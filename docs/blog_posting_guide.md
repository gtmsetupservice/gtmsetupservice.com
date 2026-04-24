# GTM Setup Service - Blog Post Structure Guide

This guide outlines the standardized structure for all technical blog posts on gtmsetupservice.com. Following this structure ensures consistency, maximizes SEO impact through rich results, and builds user trust by providing clear, scannable solutions.

## 1. Front Matter Configuration

Every post begins with a YAML front matter block. This controls the post's metadata, layout, and our custom features like FAQ schema and trust indicators.

### Complete Front Matter Template

```yaml
---
layout: post
title: "[Problem]? [Number] [Fixes/Steps] That Work [Metric] ([Year])"
description: "A concise, compelling summary of the problem and solution, under 155 characters."
date: YYYY-MM-DD HH:MM:SS +0800
author: GTM Setup Service
categories: [primary-category, secondary-category]
tags: [tag1, tag2, tag3]
featured_image: /assets/images/your-image.png

# --- Custom Trust Indicators (include 2-3 minimum) ---
fix_rate: "95%"
fix_time: "5 Minute"
diagnosis_time: "90 Second"
problem_layer: "Layer 3 (Transmission)"
fix_method: "3-Step Verification"

# --- FAQ Schema ---
# Each question/answer pair will appear as a rich result in Google Search.
faq:
  - question: "Why is my GTM tag not working even if it fires in Preview Mode?"
    answer: "This is often a Layer 3 (Transmission) or Layer 4 (Processing) issue. The data is leaving GTM but is being blocked by an ad blocker, filtered by Google, or sent with incorrect parameters."
  - question: "What is the first step to diagnose a GTM issue?"
    answer: "Use the Network tab in your browser's Developer Tools to see if data is successfully being sent to Google's servers. A '204' status code indicates success, while a 'failed' or 'blocked' status points to a transmission problem."
---
```

### Custom Field Explanations

**Trust Indicators** are displayed as icon + text badges directly below the post title. Include at least 2-3 — a single badge looks sparse. Choose only values that are credible and backed by the article's content.

Each field renders as follows:

| Field | Renders as | Example value |
|---|---|---|
| `fix_rate` | ✓ checkmark + "X% Fix Rate" | `"95%"` |
| `fix_time` | ⏱ clock + "X Fix" | `"5 Minute"` |
| `diagnosis_time` | ⚡ bolt + "X Diagnosis" | `"90 Second"` |
| `problem_layer` | 🔧 wrench + layer name | `"Layer 3 (Transmission)"` |
| `fix_method` | 📋 clipboard + method name | `"3-Step Verification"` |

**Available `problem_layer` values:**
- `"Layer 1 (Installation)"` — GTM snippet missing or wrong
- `"Layer 2 (Implementation)"` — tags, triggers, or variables misconfigured
- `"Layer 3 (Transmission)"` — hits not reaching Google's servers
- `"Layer 4 (Processing)"` — data arrives but GA4 filters or drops it

**`faq`**: Critical for SEO. Each item is converted into `FAQPage` JSON-LD schema, helping win rich results in search. Include 2-3 questions minimum. Answers should be self-contained — Google surfaces them without surrounding context.

**`featured_image`**: Store images in `/assets/images/`. Use descriptive kebab-case filenames matching the post topic (e.g., `ga4-communication-breakdown.png`). Recommended size: 1200×630px.

**`description`**: Keep under 155 characters. Verify length at [charactercounter.com](https://charactercounter.com) or count manually — Google truncates at ~155–160 characters in search results.

## 2. Titling Strategy

Titles are the most important element for click-through rate. They must be solution-focused and build immediate confidence.

**Formula:** `[Problem]? [Number] [Solution] That Work [Metric] ([Year])`

**Examples:**
- `GTM Tags Won't Fire? 3-Step Fix That Works in 5 Minutes (90% Success Rate)`
- `Consent Mode V2 Tags Won't Fire After Consent? 3 Fixes That Work Immediately (2026)`
- `GA4 DebugView Shows Data But Reports Empty? 4 Fixes That Work (2026)`

## 3. Post Body Structure

The body of the post should be structured to reduce cognitive load and guide the user to a solution as quickly as possible.

1.  **Introduction (The Hook)**:
    - State the problem in emotional, frustrating terms that the user is experiencing.
    - Briefly introduce that the cause is a specific "Layer" failure.
    - Transition directly into the Table of Contents.

2.  **Symptom-Based Table of Contents**:
    - A single flat bulleted list of anchor links — do not split into groups.
    - Do not use generic labels like "Introduction" or "The Fix" as link text.
    - Each link describes a specific failure scenario or credibility section.
    - Anchor links use inline HTML: place `<a name="your-anchor"></a>` immediately above the target heading in the post body.

    **Example TOC:**
    ```markdown
    *   [DebugView Shows Events, But No Data in Reports](#debugview-works-reports-empty)
    *   [Processing Delay is Making GA4 Reports Empty](#processing-delay)
    *   [The #1 Hidden Setting That Breaks Reports](#case-sensitivity)
    ```

    **Corresponding anchor in body:**
    ```markdown
    <a name="debugview-works-reports-empty"></a>
    ### DebugView Shows Events, But No Data in Reports
    ```

3.  **Main Content Sections**:
    - Each `H2` or `H3` should be a clear, symptom-focused heading.
    - Start each section with a **"What's Happening"** explanation.
    - Follow with a **"The Diagnostic"** or **"The Fix"** subsection containing actionable steps, code snippets, and console commands.
    - Separate major sections with a horizontal rule (`---`).

4.  **Credibility Section**:
    - Include a section like "Why Standard Fixes Fail" or "The #1 Hidden Setting People Miss".
    - This section demonstrates deeper expertise and builds significant trust.
    - Place it last, after all diagnostic/fix sections.

5.  **Closing CTA**:
    - End every post with an italic service pitch linking to the contact section.
    - Keep it one sentence. Do not use a heading — just an italicised paragraph.

    **Template:**
    ```markdown
    *Need a comprehensive GTM implementation audit? Our diagnostic service reviews your complete tag, trigger, and variable configuration, identifies gaps and errors, and provides a prioritized remediation plan. [Learn more about our GTM Audit Service](/#contact).*
    ```

## 4. Final Checklist

Before publishing, ensure your post includes:
- [ ] Front matter has `layout`, `title`, `description`, `date`, `author`, `categories`, `tags`, `featured_image`
- [ ] Description is 155 characters or fewer (verify with a character counter)
- [ ] Title follows the solution-focused formula
- [ ] At least 2-3 trust indicators set in front matter
- [ ] At least 2-3 FAQ questions and answers in the `faq` front matter variable
- [ ] Single flat symptom-based TOC with anchor links (no grouping)
- [ ] Each TOC link has a matching `<a name="..."></a>` anchor above its heading in the body
- [ ] Each main section starts with "What's Happening" and "The Diagnostic" or "The Fix"
- [ ] A credibility section ("Why X% of Fixes Fail" or "The #1 Hidden Setting")
- [ ] Closing CTA paragraph in italics at the bottom
- [ ] `featured_image` points to a real file in `/assets/images/`
- [ ] Clear, actionable diagnostic steps with code snippets where appropriate
