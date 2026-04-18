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
date: YYYY-MM-DD HH:MM:SS +/-TTTT
author: GTM Setup Service
categories: [primary-category, secondary-category]
tags: [tag1, tag2, tag3]
featured_image: /assets/images/your-image.png

# --- Custom Trust Indicators (Use any combination) ---
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

- **Trust Indicators**: These are displayed prominently below the title. Use any combination that is credible and extracted from the article's content.
  - `fix_rate`: The success rate of the proposed solution (e.g., "95%").
  - `fix_time`: How long the fix takes (e.g., "5 Minute").
  - `diagnosis_time`: How long it takes to find the problem (e.g., "90 Second").
  - `problem_layer`: The diagnostic layer of the issue, e.g., "Layer 3 (Transmission)". This builds technical authority.
  - `fix_method`: A specific methodology mentioned in the post (e.g., "3-Step Verification").
- **`faq`**: This is critical for SEO. Each item in this list will be converted into a question and answer for the FAQPage JSON-LD schema, helping you win rich results in search.

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
    - Provide a symptom-based Table of Contents.

2.  **Symptom-Based Table of Contents**:
    - Do not use generic headings like "Introduction".
    - Create a bulleted list of anchor links to the main `H2` or `H3` sections.
    - Each link should describe a specific failure scenario (e.g., "GTM Tag Shows 'Complete' But Google Ads Isn't Firing").

3.  **Main Content Sections**:
    - Each `H2` or `H3` should be a clear, symptom-focused heading.
    - Start each section with a "What's Happening" explanation.
    - Follow with a "The Diagnostic" or "The Fix" subsection containing actionable steps, code snippets, and screenshots.

4.  **Credibility Section**:
    - Include a section like "Why Standard Fixes Fail" or "The #1 Hidden Setting People Miss".
    - This section demonstrates a deeper level of expertise and builds significant trust.

## 4. Final Checklist

Before publishing, ensure your post includes:
- [ ] A complete front matter block with all relevant custom fields.
- [ ] A title that follows the solution-focused formula.
- [ ] A symptom-based TOC with anchor links.
- [ ] At least 2-3 FAQ questions and answers in the `faq` front matter variable.
- [ ] At least one custom trust indicator (`fix_rate`, `diagnosis_time`, etc.).
- [ ] Clear, actionable diagnostic steps with code snippets where appropriate.
