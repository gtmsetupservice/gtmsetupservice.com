# GTM Setup Service — Blog Post Guide

Every post published here automatically inherits structured data, GA4 tracking, and carousel eligibility. This guide covers what fires automatically, what you must provide in front matter, and how to structure content for maximum rich result coverage.

---

## 1. What Fires Automatically on Every Post

The `post.html` layout injects these schemas and tracking without any per-post configuration:

### Schemas (always present)

| Schema | Type | Purpose |
|---|---|---|
| `TechArticle` | Structured data | Article rich results, Google Discover eligibility |
| `BreadcrumbList` | Structured data | Breadcrumb display in SERPs |
| `FAQPage` | Structured data | FAQ rich results (only when `faq` front matter exists) |

The `TechArticle` schema is pre-wired with:
- `headline` ← `page.title`
- `description` ← `page.description`
- `image` ← `page.featured_image` (falls back to `page.image`)
- `author` ← Bradley Hamilton, `@id: https://gtmsetupservice.com/#person`
- `publisher` ← GTM Setup Service, `@id: https://gtmsetupservice.com/#organization`
- `datePublished` ← `page.date`
- `dateModified` ← `page.last_modified_at` (falls back to `page.date`)
- `mainEntityOfPage` ← the post URL

The `author` and `publisher` reference the sitewide `Person` and `Organization` schemas by `@id` — Google connects authorship and E-E-A-T signals automatically.

### GA4 Tracking (always active)

| Event | Fires at | Parameters |
|---|---|---|
| `scroll_milestone` | 25%, 50%, 75%, 100% scroll | `percent_scrolled`, `page_title`, `page_path` |
| `post_read_complete` | 100% scroll only | (separate GA4 event, key event in GA4) |

A reading progress bar also renders at the top of the viewport on every post.

### Homepage Carousel Connection

Every published post is automatically included in the `ItemList` schema on the homepage (`case-studies.html`). The carousel entries reference each post's `#article` fragment — which is the `TechArticle` `@id`. This means each new post you publish immediately becomes a carousel-eligible spoke connected to the homepage hub.

---

## 2. Front Matter — Complete Template

```yaml
---
layout: post
title: "[Problem]? [Number] [Fixes/Steps] That Work [Metric] ([Year])"
description: "Concise summary of problem and solution. Keep under 155 characters."
date: YYYY-MM-DD HH:MM:SS +0000
author: Bradley Hamilton
categories: [primary-category, secondary-category]
tags: [tag1, tag2, tag3]

# REQUIRED for rich results — post will be schema-incomplete without this
featured_image: /assets/images/your-image.png

# Trust indicator badges displayed below the post title (include 2-3 minimum)
fix_rate: "95%"
fix_time: "5 Minute"
diagnosis_time: "90 Second"
problem_layer: "Layer 3 (Transmission)"
fix_method: "3-Step Verification"

# FAQ schema — each item becomes a FAQPage rich result in Google Search
faq:
  - question: "Why is my GTM tag not working even though it fires in Preview Mode?"
    answer: "This is a Layer 3 (Transmission) or Layer 4 (Processing) issue. Data is leaving GTM but being blocked by an ad blocker, filtered by Google, or sent with incorrect parameters."
  - question: "What is the first step to diagnose a GTM issue?"
    answer: "Use the Network tab in browser DevTools to check if data is reaching Google's servers. A 204 status code means success. A failed or blocked status means a transmission problem."
---
```

### Field Reference

**`featured_image`** — Required for rich results. Missing this field means:
- The `TechArticle` schema renders with an empty `image` field → Google flags it as incomplete → ineligible for Article carousel
- The homepage `ItemList` entry for this post also loses its image
- Store files in `/assets/images/`. Use descriptive kebab-case names (`ga4-consent-mode-fix.png`). Recommended size: 1200×630px.

**`description`** — Used in three places: meta description tag, `TechArticle` schema, and homepage `ItemList` carousel entry. Keep under 155 characters. Verify at [charactercounter.com](https://charactercounter.com). Google truncates at ~155–160 in SERPs.

**`author`** — Set to `Bradley Hamilton`. This matches the sitewide `Person` schema. Using a different value breaks the `@id` link and weakens E-E-A-T signals.

**`faq`** — Each question/answer pair renders as `FAQPage` JSON-LD and is eligible to appear as expandable Q&A directly in SERPs. Include 2–3 minimum. Answers must be self-contained — Google surfaces them without surrounding context.

**Trust indicators** — displayed as icon + text badges below the post title:

| Field | Renders as | Example |
|---|---|---|
| `fix_rate` | ✓ X% Fix Rate | `"95%"` |
| `fix_time` | ⏱ X Fix | `"5 Minute"` |
| `diagnosis_time` | ⚡ X Diagnosis | `"90 Second"` |
| `problem_layer` | 🔧 layer name | `"Layer 3 (Transmission)"` |
| `fix_method` | 📋 method name | `"3-Step Verification"` |

**`problem_layer`** valid values:
- `"Layer 1 (Installation)"` — GTM snippet missing or wrong
- `"Layer 2 (Implementation)"` — tags, triggers, or variables misconfigured
- `"Layer 3 (Transmission)"` — hits not reaching Google's servers
- `"Layer 4 (Processing)"` — data arrives but GA4 filters or drops it

---

## 3. Rich Results — What You Get and What Requires Your Input

| Rich Result Type | Auto or Manual | Requirement |
|---|---|---|
| Article carousel eligibility | Auto (once front matter is correct) | `featured_image` + `description` + `faq` |
| FAQ rich results | Manual — needs `faq` in front matter | 2–3 Q&A pairs |
| Breadcrumb trail | Auto — always fires | Nothing |
| Sitewide price rich results | Auto — on homepage | Nothing per-post |

### Why `featured_image` is the gating field

Google's Article/TechArticle rich result requires `headline`, `image`, `author`, and `datePublished`. The layout auto-provides everything except `image` — that comes from your `featured_image` front matter. Without it, the schema is technically invalid and the post won't appear in Article carousels.

### Validating a new post

After publishing, check with [Google's Rich Results Test](https://search.google.com/test/rich-results):
- Should detect: `TechArticle`, `BreadcrumbList`, `FAQPage` (if faq present)
- `TechArticle` should show: `headline`, `image`, `author.name = Bradley Hamilton`, `datePublished`
- No "Unnamed item" warnings
- Non-critical warnings about optional fields are acceptable

---

## 4. Titling Strategy

**Formula:** `[Problem]? [Number] [Solution] That Work [Metric] ([Year])`

**Examples:**
- `GTM Tags Won't Fire? 3-Step Fix That Works in 5 Minutes (90% Success Rate)`
- `Consent Mode V2 Tags Won't Fire After Consent? 3 Fixes That Work Immediately (2026)`
- `GA4 DebugView Shows Data But Reports Empty? 4 Fixes That Work (2026)`

The year in the title signals freshness to both users and Google. Update it when you revise a post significantly — also update `last_modified_at` in front matter when you do.

---

## 5. Post Body Structure

### Introduction
- State the problem in emotional terms the user is experiencing
- Identify the Layer failure briefly
- Transition directly into the Table of Contents

### Table of Contents
- Single flat bulleted list of anchor links — no grouping
- Each link describes a specific failure scenario, not a generic label
- Use inline HTML anchors: place `<a name="your-anchor"></a>` immediately above the target heading

```markdown
* [DebugView Shows Events But No Data in Reports](#debugview-works-reports-empty)
* [Processing Delay Making GA4 Reports Empty](#processing-delay)
* [The Hidden Setting That Breaks Reports](#case-sensitivity)
```

```markdown
<a name="debugview-works-reports-empty"></a>
### DebugView Shows Events, But No Data in Reports
```

### Main Content Sections
- Each `H2`/`H3` is a clear symptom-focused heading
- Start each section with **"What's Happening"**
- Follow with **"The Diagnostic"** or **"The Fix"** with actionable steps, code snippets, console commands
- Separate major sections with `---`

### Direct Answer Paragraph
Include a short 2–3 sentence direct answer near the top of the post that answers the title question plainly. This is the text Google pulls for featured snippets. Write it as if answering someone who asked the question verbally.

### Credibility Section
- Include one section like "Why Standard Fixes Fail" or "The #1 Hidden Setting People Miss"
- Demonstrates deeper expertise, builds trust
- Place after all diagnostic/fix sections

### Closing CTA
End with a single italicised paragraph — no heading:

```markdown
*Need a comprehensive GTM implementation audit? Our diagnostic service reviews your complete tag, trigger, and variable configuration, identifies gaps and errors, and provides a prioritized remediation plan. [Learn more about our GTM Audit Service](/#contact).*
```

---

## 6. Pre-Publish Checklist

### Front Matter
- [ ] `layout: post`
- [ ] `title` follows solution-focused formula with year
- [ ] `description` is 155 characters or fewer
- [ ] `date` is set (use future dates carefully — `future: true` is enabled)
- [ ] `author: Bradley Hamilton`
- [ ] `categories` and `tags` set
- [ ] `featured_image` points to a real file in `/assets/images/` — **required for rich results**
- [ ] 2–3 trust indicator fields set (`fix_rate`, `fix_time`, `diagnosis_time`, `problem_layer`, `fix_method`)
- [ ] `faq` has 2–3 self-contained question/answer pairs

### Content
- [ ] Direct answer paragraph near the top (for featured snippet)
- [ ] Single flat symptom-based TOC with anchor links
- [ ] Each TOC link has a matching `<a name="..."></a>` anchor in the body
- [ ] Each main section has "What's Happening" + "The Diagnostic" or "The Fix"
- [ ] Credibility section present
- [ ] Closing CTA in italics at the bottom

### Schema Validation (after publishing)
- [ ] Run through [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] `TechArticle` detected with `headline`, `image`, `author`, `datePublished`
- [ ] `BreadcrumbList` detected
- [ ] `FAQPage` detected (if `faq` front matter present)
- [ ] No "Unnamed item" warnings
- [ ] Post appears in homepage `ItemList` after site rebuild
