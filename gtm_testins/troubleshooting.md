# GTM → GA4 Tracking Troubleshooting Procedure

Work through each layer in order. Each layer depends on the one above it — don't skip ahead.

---

## Layer 1: Site Installation

**Goal:** Confirm GTM snippet is present and loading correctly on the page.

| # | Check | Tool | Pass Condition |
|---|-------|------|----------------|
| 1.1 | GTM `<head>` snippet present | View Source → search `GTM-` | Found in `<head>` before other scripts |
| 1.2 | GTM `<body>` noscript iframe present | View Source → search `googletagmanager.com/ns.html` | Found immediately after `<body>` tag |
| 1.3 | Correct container ID in both snippets | View Source | Both snippets reference same `GTM-XXXXXXX` |
| 1.4 | GTM container JS loading | DevTools → Network → filter `gtm.js` | Request present, status 200 |
| 1.5 | No CSP errors blocking GTM | DevTools → Console | No `Content-Security-Policy` errors |
| 1.6 | `dataLayer` initialized | DevTools → Console → type `window.dataLayer` | Returns array, not undefined |

**Quick CLI check:**
```bash
curl -s https://yoursite.com | grep -o "GTM-[A-Z0-9]*"
```

---

## Layer 2: GTM Container Configuration

**Goal:** Confirm the published container has the correct tags, triggers, and variable values.

| # | Check | Tool | Pass Condition |
|---|-------|------|----------------|
| 2.1 | GA4 tag exists in container | GTM UI → Tags | "Google Tag" or "GA4 Configuration" tag present |
| 2.2 | Tag ID uses correct measurement ID | GTM UI → Tag → Tag ID field | Shows `G-XXXXXXXXXX` or resolves to it via variable |
| 2.3 | Variable resolves correctly | GTM UI → Variables → inspect constant | Value matches GA4 measurement ID exactly |
| 2.4 | Trigger is Initialization - All Pages | GTM UI → Tag → Firing Triggers | `gtm.init` trigger attached |
| 2.5 | No blocking triggers on the tag | GTM UI → Tag → Blocking Triggers | None listed |
| 2.6 | Container is published (not just saved) | GTM UI → top bar | Version number shown, no "Draft" indicator |
| 2.7 | Published container contains measurement ID | CLI | See below |
| 2.8 | Container version matches expected | GTM UI → Version History | Latest published version is the one you intended |

**Verify published container contains your GA4 ID:**
```bash
curl -s "https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX" | grep -o "G-[A-Z0-9]*"
```

**Confirm tag structure in published container:**
```bash
curl -s "https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX" | python3 -c "
import sys, re
data = sys.stdin.read()
m = re.search(r'\"resource\".*?\"rules\".*?\]\]', data, re.DOTALL)
print(m.group(0)[:1000] if m else 'resource block not found')
"
```

---

## Layer 3: Tag Firing (Preview Mode)

**Goal:** Confirm the tag fires in a controlled test environment before checking live.

| # | Check | Tool | Pass Condition |
|---|-------|------|----------------|
| 3.1 | Enter preview mode | GTM → Preview button | Tag Assistant loads, `?gtm_debug=` appears in URL |
| 3.2 | Page loads in Tag Assistant | Tag Assistant | Site appears in connected devices |
| 3.3 | GA4 tag appears in "Tags Fired" | Tag Assistant → Tags tab | Tag listed under "Tags Fired", not "Tags Not Fired" |
| 3.4 | Firing Status is Succeeded | Tag Assistant → click tag | Status shows "Succeeded", not "Failed" |
| 3.5 | Tag ID resolves to correct value | Tag Assistant → tag properties | Tag ID shows `G-XXXXXXXXXX`, not `""` or `undefined` |
| 3.6 | Hits sent section shows page_view | Tag Assistant → tag properties | "Hits sent" lists `Page View` with correct measurement ID |
| 3.7 | dataLayer contains GTM lifecycle events | Tag Assistant → Data Layer tab | `gtm.js`, `gtm.dom`, `gtm.load` present |

**If Tag ID shows `""` in properties but correct in Hits Sent:** This is a display quirk — GTM shows the variable pre-resolution in properties. Check Hits Sent for the actual fired value.

**If tag is in "Tags Not Fired":** Check trigger configuration (2.4) and any blocking triggers (2.5).

---

## Layer 4: Network Requests

**Goal:** Confirm GA4 collect requests are actually leaving the browser.

| # | Check | Tool | Pass Condition |
|---|-------|------|----------------|
| 4.1 | Open site in incognito | Chrome incognito | Eliminates extension interference |
| 4.2 | Open DevTools before navigating | F12 → Network tab → check "Preserve log" | Network tab recording |
| 4.3 | Filter for collect requests | Network → filter bar → type `collect` | Request to `google-analytics.com/g/collect` appears |
| 4.4 | Request returns 200 or 204 | Network → click request → Status | 200 or 204 (both are success) |
| 4.5 | Measurement ID in request URL | Network → click request → Headers | `tid=G-XXXXXXXXXX` in query string |
| 4.6 | `en` parameter shows `page_view` | Network → click request → Payload | `en=page_view` present |
| 4.7 | No requests if collect missing | Network → filter `gtag/js` | `gtag/js?id=G-XXXXXXXXXX` loads after GTM fires |
| 4.8 | Test without ad blocker | Incognito with no extensions | If collect appears only in incognito, ad blocker is culprit |

**If `collect` never appears:** GA4 tag is not firing or `gtag/js` failed to load. Check Layer 2 and 3.

**If `collect` appears but GA4 shows nothing:** Issue is on GA4's receiving end — continue to Layer 5.

---

## Layer 5: GA4 Property Configuration

**Goal:** Confirm the GA4 property is configured to receive and display data.

| # | Check | Tool | Pass Condition |
|---|-------|------|----------------|
| 5.1 | Correct property open | GA4 → top-left property selector | Property name/ID matches your intended property |
| 5.2 | Web data stream exists | GA4 → Admin → Data Streams | Web stream listed |
| 5.3 | Stream URL matches site domain | GA4 → Admin → Data Streams → stream | `https://yoursite.com` shown |
| 5.4 | Measurement ID matches GTM | GA4 → Admin → Data Streams → stream | `G-XXXXXXXXXX` matches what's in GTM |
| 5.5 | Data collection active | GA4 → Admin → Data Streams → stream | "Data collection is active" shown |
| 5.6 | No active internal traffic filter | GA4 → Admin → Data Settings → Data Filters | No "Internal Traffic" filter set to Active |
| 5.7 | No other active exclusion filters | GA4 → Admin → Data Settings → Data Filters | Review all active filters |
| 5.8 | Your IP not defined as internal | GA4 → Admin → Data Settings → Data Filters → Internal Traffic → edit | Your current IP not in the list |

**Check your current IP:**
```bash
curl -s ifconfig.me
```

---

## Layer 6: Data Verification

**Goal:** Confirm data is appearing in GA4 reports.

| # | Check | Tool | Pass Condition |
|---|-------|------|----------------|
| 6.1 | DebugView shows events | GA4 → Admin → DebugView (while in GTM preview) | Events stream in real time |
| 6.2 | Realtime shows active users | GA4 → Reports → Realtime (visit site, check within 30s) | Your visit appears |
| 6.3 | Realtime shows page_view event | GA4 → Realtime → scroll to Events | `page_view` listed |
| 6.4 | Events report shows data | GA4 → Reports → Engagement → Events (allow 24-48h) | `page_view` count growing |
| 6.5 | Form submission events tracked | Submit test form → check Realtime | `form_submission` or `generate_lead` event appears |

**DebugView note:** Only shows hits from devices in GTM preview mode or with `debug_mode: true` in the GA4 config tag. Use Realtime for non-debug live verification.

**Realtime note:** Shows last 30 minutes only. Must check within 30 seconds of your visit.

---

## Layer 7: Automated Baseline (audit.py)

Run this first on any new site to get a quick read before going manual.

```bash
python3 audit.py https://yoursite.com
```

| Output field | What it tells you |
|---|---|
| `gtm_container_id: "NOT_FOUND"` | Layer 1 failure — GTM not installed |
| `gtm_container_id: "GTM-XXXXX"` | Layer 1 passed |
| `ga4_request_count: 0` | Layer 3/4 failure — hits not reaching GA4 |
| `ga4_measurement_ids: []` | GA4 tag not firing or wrong endpoint |
| `ga4_measurement_ids: ["G-XXX"]` | Tag firing, correct property |
| `consent_mode_v2_active: false` | No consent mode — note for EU clients |
| `findings[severity=critical]` | Immediate action required |
| `findings[severity=warning]` | Should fix, not blocking |

---

## Common Failure Patterns

| Symptom | Most Likely Cause | Fix |
|---------|------------------|-----|
| GTM fires in preview, not live | Container not published / published wrong version | GTM → Submit → Publish |
| Tag fires but GA4 Realtime shows 0 | Internal traffic filter active | GA4 → Data Filters → disable or whitelist IP |
| Tag ID shows `""` in Tag Assistant | Variable not resolving at init time | Normal display quirk — check Hits Sent section instead |
| `collect` request blocked | Ad blocker or browser privacy setting | Test in incognito, advise client |
| Multiple GA4 IDs firing | Duplicate tags or hardcoded gtag snippet + GTM | Remove hardcoded snippet or consolidate tags |
| Cookie banner present, consent mode inactive | CMP not integrated with GTM | Connect CMP to GTM via consent mode API |
| `gtm_size_kb` > 50 | Bloated container | Audit and remove unused tags/triggers/variables |
