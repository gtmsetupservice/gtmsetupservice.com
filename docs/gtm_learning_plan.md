# GTM Analytics Implementation Plan
## For gtmsetupservice.com

This plan teaches you to analyze what you need to measure, identify the right tags, and implement them correctly — in the order that builds the most complete picture of your business.

Each phase is a working session. Complete one before moving to the next.

---

## How to Read This Plan

Every tag you implement answers a specific business question. If you can't articulate the question, you don't need the tag. The question is listed first in each section — that's the anchor.

**Your site's single conversion event:** A qualified lead submits the contact form.  
Everything else is either attribution (how did they get here) or behavior (what did they do before converting).

---

## Phase 1: Mental Model
**Before touching GTM, understand the three-layer system.**

### The Three Players

```
Your Website
    ↓  pushes events to
window.dataLayer  (the message bus)
    ↓  GTM reads from
Google Tag Manager  (the router)
    ↓  fires tags to
GA4 / Google Ads / etc.  (the destinations)
```

- **dataLayer** is just a JavaScript array on your page. Your site pushes objects into it.
- **GTM** watches the dataLayer, and when it sees specific events, fires tags.
- **Tags** are code snippets that send data somewhere.

### The GTM Vocabulary

| Term | Plain English | Example |
|------|--------------|---------|
| Tag | A script that sends data somewhere | GA4 Event tag |
| Trigger | A condition that causes a tag to fire | "When someone clicks #submit-btn" |
| Variable | A value GTM reads from the page or dataLayer | The form's service_type field |
| Event | A signal pushed to the dataLayer | `{event: 'form_submission'}` |

### The Mental Check Before Every Tag

Ask yourself:
1. **What business question does this answer?**
2. **What action on the page signals this happened?**
3. **What data do I need alongside it?** (parameters)
4. **What will I do with the answer in GA4?**

If you can't answer all four, pause before implementing.

---

## Phase 2: Conversion Tracking — The Only Thing That Matters Right Now

**Business question:** Are people submitting the contact form, and which service are they asking about?

Your form handler (`/assets/js/form-handler.js`) already pushes this to the dataLayer on successful submission:

```javascript
dataLayer.push({
    'event': 'form_submission',
    'form_name': 'gtm_contact_form',
    'service_type': 'gtm',
    'problem_type': data.problem,
    'conversion_value': 397
});
```

### Tags to Build

#### Tag 1: GA4 — Lead Event
**What it answers:** How many qualified leads did we get, and which service did they want?

- **Tag type:** GA4 Event
- **Event name:** `generate_lead`
- **Parameters to send:**
  - `service_type` → Variable: DLV - service_type
  - `problem_type` → Variable: DLV - problem_type
  - `value` → Variable: DLV - conversion_value
  - `currency` → Constant: USD
- **Trigger:** Custom Event → `form_submission`

#### Variables to Create First
Before building Tag 1, create these Data Layer Variables in GTM:

| Variable Name | Data Layer Key | Type |
|---|---|---|
| DLV - service_type | service_type | Data Layer Variable |
| DLV - problem_type | problem_type | Data Layer Variable |
| DLV - conversion_value | conversion_value | Data Layer Variable |
| DLV - form_name | form_name | Data Layer Variable |

#### How to Verify
1. Open Tag Assistant → Preview → submit the contact form with test data
2. In Tag Assistant: Tag 1 should appear in "Tags Fired" after form submit
3. In GA4 → Realtime → Events: `generate_lead` should appear within 30 seconds
4. Click the event → confirm `service_type` and `problem_type` parameters are present

**Do not proceed to Phase 3 until this fires cleanly.**

---

## Phase 3: CTA Click Tracking

**Business question:** Which call-to-action buttons are people clicking before they convert?

Your site has multiple CTAs across multiple pages:
- "Get Emergency GTM Fix - $397" (hero)
- "Get Emergency Fix" (services section)
- "Get Full Audit"
- "Start Monitoring"
- "Contact GTM Expert" (form submit button)
- Blog post: "Get Emergency GTM Fix - $397" (bottom of each post)

### Tag 2: GA4 — CTA Click

- **Tag type:** GA4 Event
- **Event name:** `cta_click`
- **Parameters:**
  - `cta_text` → Built-In Variable: Click Text
  - `cta_url` → Built-In Variable: Click URL
  - `page_path` → Built-In Variable: Page Path
- **Trigger:** Click — Just Links, matching `.bg-red-600, .bg-green-500, .bg-blue-600, #submit-btn`

**Enable these Built-In Variables first (GTM → Variables → Configure):**
- Click Text
- Click URL
- Click Classes
- Click ID
- Page Path
- Page Title

#### How to Verify
1. Tag Assistant → Preview → click each CTA button
2. Tag Assistant should show `cta_click` in Tags Fired for each click
3. GA4 Realtime → confirm `cta_text` parameter shows the button label

**Why this matters:** If "Get Full Audit" gets 40 clicks but generates 0 leads, the audit page needs work. If "Get Emergency Fix" drives 90% of leads, it should get more visual prominence.

---

## Phase 4: Blog Content Engagement

**Business question:** Which blog posts drive the most contact form visits? Do readers who reach the bottom convert at a higher rate?

### Tag 3: GA4 — Scroll Depth (Blog Posts Only)

Your post layout already has scroll tracking in JavaScript — but it fires `gtag()` directly, bypassing the dataLayer. You want this in GA4 via GTM so it's consistent with everything else.

- **Tag type:** GA4 Event
- **Event name:** `scroll_milestone`
- **Parameters:**
  - `percent_scrolled` → Data Layer Variable (you'll push this)
  - `page_title` → Built-In Variable: Page Title
  - `page_path` → Built-In Variable: Page Path
- **Trigger:** Custom Event → `scroll_milestone`

Update `post.html` to push to the dataLayer instead of calling `gtag()` directly:

```javascript
// Replace the existing gtag scroll calls with:
dataLayer.push({
    'event': 'scroll_milestone',
    'percent_scrolled': 75,
    'page_title': document.title
});
```

### Tag 4: GA4 — Blog Post Read (100% Scroll)
Same setup as Tag 3 but trigger only fires when `percent_scrolled` equals 100. This is your "post fully read" signal.

- **Event name:** `post_read_complete`
- **Trigger:** Custom Event → `scroll_milestone` with condition: DLV - percent_scrolled equals 100

#### How to Verify
1. Open a blog post → scroll to bottom
2. GA4 Realtime → `scroll_milestone` and `post_read_complete` events appear
3. Confirm `page_path` shows the blog post URL

---

## Phase 5: Attribution — Where Leads Come From

**Business question:** Which traffic source generates leads that convert? Reddit? Direct? Google?

GA4 collects UTM parameters automatically if they're in the URL. Your form handler already captures them:

```javascript
utm_source: data.utm_source || '',
utm_medium: data.utm_medium || '',
utm_campaign: data.utm_campaign || ''
```

### What You Get For Free (No Tags Needed)
GA4 automatically attributes sessions to:
- `utm_source` / `utm_medium` / `utm_campaign` in the URL
- Referrer headers

### Tag 5: GA4 — Session Source Attribution on Lead
Augment your `generate_lead` event (Tag 1) with session-level attribution by adding these parameters:

| Parameter | Variable Type | Value |
|---|---|---|
| `traffic_source` | Data Layer Variable | utm_source |
| `traffic_medium` | Data Layer Variable | utm_medium |
| `traffic_campaign` | Data Layer Variable | utm_campaign |
| `referring_page` | JavaScript Variable | `document.referrer` |

Add a JavaScript Variable in GTM:
- **Variable type:** Custom JavaScript
- **Name:** JS - Referrer
- **Code:** `function() { return document.referrer; }`

#### How to Verify
Go to GA4 → Reports → Acquisition → Traffic Acquisition after a few real leads. You should see source/medium breakdown. For immediate testing, submit the form from a URL with `?utm_source=test&utm_medium=manual` appended.

---

## Phase 6: Outbound Link Tracking

**Business question:** Are people clicking any external links that indicate purchase intent (e.g., links to your Reddit profile, booking system, or third-party tools)?

### Tag 6: GA4 — Outbound Click
- **Tag type:** GA4 Event
- **Event name:** `outbound_click`
- **Parameters:**
  - `link_url` → Built-In Variable: Click URL
  - `link_text` → Built-In Variable: Click Text
  - `page_path` → Built-In Variable: Page Path
- **Trigger:** Click — Just Links, with condition: Click URL does not contain `gtmsetupservice.com`

---

## Phase 7: Error & Failure Tracking

**Business question:** Are people hitting errors that stop them from converting?

### Tag 7: GA4 — Form Error
Your form handler already fires this via `gtag()`. Move it to the dataLayer:

- **Event name:** `form_error`
- **Parameter:** `error_type` → Data Layer Variable

### Tag 8: GA4 — 404 Page Hit
Create a trigger that fires only on your 404 page:
- **Trigger type:** Page View
- **Condition:** Page Title contains "404" OR Page Path equals "/404.html"
- **Event name:** `page_not_found`
- **Parameter:** `page_path` → the broken URL

---

## Phase 8: GA4 Configuration — Custom Dimensions

After Phases 2-7 are running, register your custom event parameters as Custom Dimensions in GA4 so they appear in reports.

**GA4 → Admin → Custom Definitions → Custom Dimensions**

| Dimension Name | Event Parameter | Scope |
|---|---|---|
| Service Type | service_type | Event |
| Problem Type | problem_type | Event |
| Problem Layer | problem_layer | Event |
| CTA Text | cta_text | Event |
| Percent Scrolled | percent_scrolled | Event |
| Traffic Source | traffic_source | Event |

**Note:** GA4 takes 24-48 hours to populate custom dimensions after you register them. Create them now, data backfills from that point forward.

---

## Phase 9: GA4 Reports to Build

Once all tags are running, build these Explorations in GA4:

### Report 1: Lead Attribution Funnel
**Path:** GA4 → Explore → Funnel Exploration  
**Steps:**
1. Session start (all traffic)
2. `page_view` on any blog post
3. `cta_click`
4. `generate_lead`

This shows where in the journey people drop off.

### Report 2: Blog Post Performance
**Path:** GA4 → Explore → Free Form  
**Dimensions:** Page Path, `post_read_complete`  
**Metrics:** Sessions, `generate_lead` count  
Shows which posts drive the most bottom-of-funnel action.

### Report 3: Service Type Breakdown
**Path:** GA4 → Explore → Free Form  
**Dimension:** `service_type`  
**Metric:** `generate_lead` count  
Shows which service drives the most inquiries.

---

## Implementation Order Summary

| Phase | Tag | Business Question | Complexity |
|---|---|---|---|
| 2 | Lead Event | Are we getting leads? Which service? | Low |
| 3 | CTA Click | Which CTAs work? | Low |
| 4 | Scroll Depth | Are people reading posts? | Medium |
| 5 | Attribution | Where do leads come from? | Low |
| 6 | Outbound Links | Where do people go after us? | Low |
| 7 | Form Errors | What's stopping conversions? | Low |
| 7 | 404 Errors | Are broken links killing leads? | Low |
| 8 | Custom Dimensions | Reports | Config only |
| 9 | GA4 Reports | Analysis | Config only |

**Start with Phase 2. Everything else builds on knowing you have clean lead data.**

---

## Validation Protocol for Every Tag

Run this checklist before marking any tag as complete:

1. **Preview mode fires it** — Tag Assistant shows "Succeeded"
2. **Parameters are populated** — No empty strings, no "undefined"
3. **GA4 Realtime shows it** — Within 30 seconds of the action
4. **Custom dimension is registered** — If the parameter matters for reports
5. **`audit.py` baseline updated** — Run the audit before and after; confirm `ga4_request_count` reflects the new events

---

## Running Session Notes

Use this section to track what's been implemented and what's pending.

| Tag | Status | Date | Notes |
|---|---|---|---|
| GA4 Configuration | ✅ Live | 2026-04-25 | GTM-M3CR8QZP, G-EL900BEWMS |
| Lead Event | ⬜ Pending | | |
| CTA Click | ⬜ Pending | | |
| Scroll Depth | ⬜ Pending | | |
| Post Read Complete | ⬜ Pending | | |
| Attribution | ⬜ Pending | | |
| Outbound Links | ⬜ Pending | | |
| Form Errors | ⬜ Pending | | |
| 404 Errors | ⬜ Pending | | |
| Custom Dimensions | ⬜ Pending | | |
