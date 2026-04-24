import argparse
import json
import sys
import os
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright

# PORTABLE FIX: Force Playwright to use the local 'pw-browsers' folder
current_dir = os.path.dirname(os.path.abspath(__file__))
os.environ["PLAYWRIGHT_BROWSERS_PATH"] = os.path.join(current_dir, "pw-browsers")

def detect_cookie_banner(page):
    """
    Scans the DOM for common CMP signatures and heuristic banner patterns.
    """
    known_cmps = {
        "Cookiebot": "#CybotCookiebotDialog",
        "OneTrust": "#onetrust-consent-sdk",
        "Usercentrics": "#usercentrics-root",
        "Termly": "#termly-code-snippet-support",
        "CookieYes": ".cky-consent-container",
        "Complianz": ".cmplz-cookiebanner",
        "Osano": ".osano-cm-window"
    }

    detected_provider = None
    
    for name, selector in known_cmps.items():
        if page.locator(selector).count() > 0:
            detected_provider = name
            break

    heuristic_match = False
    if not detected_provider:
        try:
            body_text = page.locator("body").inner_text().lower()
            if "cookie" in body_text or "consent" in body_text:
                accept_buttons = page.get_by_role("button", name="Accept").count() + \
                                 page.get_by_role("button", name="Allow").count() + \
                                 page.get_by_role("button", name="Agree").count()
                
                if accept_buttons > 0:
                    heuristic_match = True
        except Exception:
            pass 

    return {
        "banner_present": bool(detected_provider or heuristic_match),
        "cmp_provider": detected_provider if detected_provider else ("Custom/Unknown" if heuristic_match else None)
    }

DEFAULT_GTM_EVENTS = {"gtm.js", "gtm.init", "gtm.init_consent", "gtm.dom", "gtm.load"}

def generate_findings(results):
    findings = []
    gtm_missing = results["gtm_container_id"] == "NOT_FOUND"
    ga4_firing = results["ga4_request_count"] > 0
    meaningful_events = [
        e for e in results["detected_datalayer_events"]
        if e and e not in DEFAULT_GTM_EVENTS
    ]

    if gtm_missing:
        findings.append({
            "severity": "critical",
            "issue": "No GTM container installed — zero tracking capability"
        })
    elif not ga4_firing:
        findings.append({
            "severity": "critical",
            "issue": "GTM installed but no GA4 hits detected — conversion tracking is broken"
        })
    elif "UNKNOWN" in results["ga4_measurement_ids"] or not results["ga4_measurement_ids"]:
        findings.append({
            "severity": "critical",
            "issue": "GA4 hits firing but measurement ID undetected — data may be going to wrong property"
        })

    if len(results["ga4_measurement_ids"]) > 1:
        findings.append({
            "severity": "critical",
            "issue": f"Multiple GA4 measurement IDs firing ({', '.join(results['ga4_measurement_ids'])}) — data is split across properties"
        })

    if results["cookie_banner_detected"] and not results["consent_mode_v2_active"]:
        findings.append({
            "severity": "warning",
            "issue": f"Cookie banner ({results['cmp_provider']}) present but Consent Mode v2 not active — banner is not connected to GTM"
        })
    elif not results["consent_mode_v2_active"] and not results["cookie_banner_detected"]:
        findings.append({
            "severity": "warning",
            "issue": "No consent mode and no cookie banner — compliance risk if running EU ad campaigns"
        })

    gtm_size = results["gtm_size_kb"]
    if isinstance(gtm_size, (int, float)) and gtm_size > 50:
        findings.append({
            "severity": "warning",
            "issue": f"GTM container is {gtm_size}kb — bloated container slowing page load"
        })

    if not gtm_missing and results["element_count"] > 0 and not meaningful_events:
        findings.append({
            "severity": "warning",
            "issue": "Buttons and forms detected but no custom dataLayer events — interactions are not being tracked"
        })

    if not results["meta_pixel_active"]:
        findings.append({
            "severity": "info",
            "issue": "No Meta/Facebook Pixel detected — retargeting audience not being built"
        })

    return findings


def audit_site(url):
    """
    Performs a technical audit of a site's GTM, GA4, Meta Pixel, and Consent configuration.
    """
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
            
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            page = context.new_page()

            # Storage for network requests
            ga4_hits = []
            fb_hits = []
            li_hits = []

            def intercept_request(request):
                u = request.url
                if "google-analytics.com/g/collect" in u or "analytics.google.com/g/collect" in u:
                    ga4_hits.append(u)
                elif "facebook.com/tr/" in u:
                    fb_hits.append(u)
                elif "px.ads.linkedin.com/collect" in u:
                    li_hits.append(u)

            # requestfinished catches both regular requests and sendBeacon hits
            page.on("requestfinished", intercept_request)

            print(f"--- Starting Audit for: {url} ---", file=sys.stderr)
            page.goto(url, wait_until="networkidle", timeout=60000)
            page.wait_for_timeout(3000)
            
            banner_status = detect_cookie_banner(page)
            data_layer = page.evaluate("window.dataLayer || []")
            
            gtm_info = page.evaluate("""() => {
                const script = document.querySelector('script[src*="gtm.js"]');
                if (!script) return { size: 0, id: "NOT_FOUND" };
                const entry = performance.getEntriesByName(script.src)[0];
                return {
                    size: entry ? entry.encodedBodySize : 0,
                    container_id: script.src.match(/id=([^&]+)/)?.[1] || "UNKNOWN"
                };
            }""")

            # --- ADDED: Map Interactive Elements ---
            interactive_elements = page.evaluate("""() => {
                const elements = [];
                const items = document.querySelectorAll('button, a, form');
                
                items.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0;
                    
                    if (isVisible) {
                        elements.push({
                            type: el.tagName.toLowerCase(),
                            text: el.innerText.trim().substring(0, 40) || el.getAttribute('aria-label') || "No Text",
                            id: el.id || null,
                            classes: el.className || null,
                            href: el.href || null
                        });
                    }
                });
                return elements.slice(0, 15); // Top 15 to avoid token bloat
            }""")

            gcd_val = next((hit.split("gcd=")[1].split("&")[0] for hit in ga4_hits if "gcd=" in hit), None)

            ga4_measurement_ids = list({
                parse_qs(urlparse(hit).query).get("tid", ["UNKNOWN"])[0]
                for hit in ga4_hits
            })

            # Process Meta (Facebook) Pixel Data
            fb_pixel_data = {}
            for hit in fb_hits:
                parsed_url = urlparse(hit)
                params = parse_qs(parsed_url.query)
                
                # Extract the Pixel ID ('id') and the Event Name ('ev')
                pixel_id = params.get('id', ['UNKNOWN'])[0]
                event_name = params.get('ev', ['UNKNOWN'])[0]
                
                if pixel_id not in fb_pixel_data:
                    fb_pixel_data[pixel_id] = []
                
                if event_name not in fb_pixel_data[pixel_id]:
                    fb_pixel_data[pixel_id].append(event_name)

            # --- ADDED: Process LinkedIn Insight Tag Data ---
            li_pixel_data = {}
            for hit in li_hits:
                parsed_url = urlparse(hit)
                params = parse_qs(parsed_url.query)
                partner_id = params.get('pid', ['UNKNOWN'])[0]
                event_type = params.get('conversionId', [None])[0] or params.get('eventType', ['PageView'])[0]
                if partner_id not in li_pixel_data:
                    li_pixel_data[partner_id] = []
                if event_type not in li_pixel_data[partner_id]:
                    li_pixel_data[partner_id].append(event_type)

            results = {
                "url": url,
                "gtm_container_id": gtm_info["container_id"],
                "gtm_size_kb": round(gtm_info["size"] / 1024, 2) if gtm_info["size"] > 0 else "cached",
                "cookie_banner_detected": banner_status["banner_present"],
                "cmp_provider": banner_status["cmp_provider"],
                "consent_mode_v2_active": bool(gcd_val),
                "consent_gcd_string": gcd_val,
                "meta_pixel_active": len(fb_pixel_data) > 0,
                "meta_pixels_detected": [{"pixel_id": pid, "events": evts} for pid, evts in fb_pixel_data.items()],
                "linkedin_insight_tag_active": len(li_pixel_data) > 0, # ADDED to dictionary
                "linkedin_partner_ids_detected": [{"partner_id": pid} for pid in li_pixel_data.keys()], # ADDED to dictionary
                "ga4_measurement_ids": ga4_measurement_ids,
                "ga4_request_count": len(ga4_hits),
                "detected_datalayer_events": [e.get('event') for e in data_layer if isinstance(e, dict) and 'event' in e],
                "interactive_elements": interactive_elements, # Added to dictionary
                "element_count": len(interactive_elements)     # Added to dictionary
            }
            
            results["findings"] = generate_findings(results)
            return results

        except Exception as e:
            return {"url": url, "error": str(e)}
        finally:
            if 'browser' in locals():
                browser.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Audit a website for GTM/GA4/Meta configuration.")
    parser.add_argument("url", help="The full URL (including https://) of the site to scan.")
    args = parser.parse_args()

    if not args.url.startswith("http"):
        print("Error: URL must start with http:// or https://", file=sys.stderr)
        sys.exit(1)

    final_audit = audit_site(args.url)
    print(json.dumps(final_audit, indent=4))