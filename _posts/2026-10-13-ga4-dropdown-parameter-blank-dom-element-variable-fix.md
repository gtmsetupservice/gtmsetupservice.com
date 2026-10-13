---
layout: post
title: "GA4 Dropdown Parameter Sending Blank? The DOM Element Variable Mistake (2026)"
description: "A GTM DOM Element variable reads a select field's value attribute and sends an empty string to GA4. The attribute doesn't exist on a select — here's the actual fix."
date: 2026-10-13 16:30:00 +0800
author: GTM Setup Service
categories: [diagnostics, ga4-parameters, gtm-variables]
tags: [GTM, GA4, DOM-Element-variable, select, form-tracking, Layer-2, Implementation]
featured_image: /assets/images/dom-element-select-value-fix.jpg
fix_time: "3 Minute"
diagnosis_time: "60 Second"
problem_layer: "Layer 2 (Implementation)"
fix_method: "Custom JavaScript Variable"

faq:
  - question: "Why does my GA4 event parameter for a dropdown field always send blank?"
    answer: "If the variable capturing it is a GTM DOM Element variable with Attribute Name set to 'value', it's reading the select element's HTML value attribute, which doesn't exist on a <select> tag — only on its <option> children. The variable has nothing to read and returns an empty string, even though the dropdown clearly has a value selected."
  - question: "What's the difference between a DOM attribute and a DOM property in this context?"
    answer: "An HTML attribute is what's written in the markup itself (<option value=\"X\">). A DOM property is the live, current state of the element in the browser (element.value), which for a <select> reflects whichever option the user has chosen and is never written back into the HTML as an attribute. GTM's DOM Element variable with an Attribute Name reads the attribute, not the live property."
  - question: "How do I correctly capture a select field's selected value in GTM?"
    answer: "Use a Custom JavaScript variable that reads the element's .value property directly, e.g. a function returning document.querySelector('#your-select').value. This reads the live DOM property rather than a non-existent HTML attribute, and works correctly regardless of whether the option text and value strings match."
step: configuration
card_blurb: "Why a DOM Element variable reads blank on a select field, and the Custom JavaScript fix."
---

A GTM DOM Element variable configured to read a `<select>` field's "value" via Attribute Name always returns an empty string, even with a value clearly selected. The cause: a `<select>` tag has no `value` HTML attribute to read — only its `<option>` children do. GTM's DOM Element variable with an Attribute Name reads the static attribute off the tag, not the live `.value` property that actually reflects the user's selection. The fix is a Custom JavaScript variable that reads the property directly.

### What You're Seeing
*   [GA4 Parameter Always Blank Despite a Selected Value](#parameter-always-blank)
*   [Trigger Fires Correctly, Tag Executes, Parameter Still Empty](#trigger-fires-param-empty)

### The Fix
*   [Replace the DOM Element Variable with a Custom JavaScript Variable](#custom-js-variable)
*   [Verify the Resolved Value in Preview](#verify-resolved-value)

---

<a name="parameter-always-blank"></a>
### GA4 Parameter Always Blank Despite a Selected Value

**What's Happening:**
You've built a DOM Element variable — Element Selector pointed at your `<select>`, Attribute Name set to `value` — and wired it into a GA4 event parameter. The tag fires. The parameter arrives at GA4 as an empty string, every time, regardless of which option was actually chosen.

A `<select>` element's chosen state lives entirely in a JavaScript DOM property (`element.value`), which reflects whichever `<option>` is currently selected. It is never written back into the HTML as a `value` attribute on the `<select>` tag itself — only `<option>` elements carry a literal `value` attribute in the markup. GTM's DOM Element variable, when given an Attribute Name, calls `element.getAttribute(attributeName)` — the attribute-reading method, not the live-property-reading one. For a `<select>`, that attribute simply doesn't exist, so the call returns nothing.

**The Diagnostic:**
Pull the Tag Assistant JSON export and check `macroInfo[]` for the variable — `rawResolvedValue: ""` with an otherwise correctly-configured selector is the signature of this exact bug.

---

<a name="trigger-fires-param-empty"></a>
### Trigger Fires Correctly, Tag Executes, Parameter Still Empty

**What's Happening:**
This isn't a trigger problem or a tag-wiring problem — both can be completely correct, confirmed via `execute_succeeded` in the JSON export, while the parameter is still blank. It's isolated entirely to how the variable itself reads the field, which is easy to miss because everything else in the chain looks and behaves correctly.

**The Diagnostic:**
If the trigger passes and the tag executes but one specific parameter is consistently empty, check that parameter's variable in isolation before touching anything else in the trigger or tag configuration.

---

<a name="custom-js-variable"></a>
## Fix 1: Replace the DOM Element Variable with a Custom JavaScript Variable

**Step 1 — Create a new variable:** Variables → New → Variable Type: **Custom JavaScript**.

**Step 2 — Write a function that reads the live property:**
```javascript
function() {
  var el = document.querySelector('#your-select-id');
  return el ? el.value : undefined;
}
```

**Step 3 — Name it** and save. The function's return value becomes the variable's resolved value automatically — no separate assignment step needed.

**Step 4 — Update the tag** to reference the new variable in place of the old DOM Element one.

This reads `.value` as a live DOM property, which correctly reflects whatever the user actually selected — unlike reading a `value` attribute that was never written to the `<select>` tag in the first place.

---

<a name="verify-resolved-value"></a>
## Fix 2: Verify the Resolved Value in Preview

**Step 1 — Open GTM Preview mode**, no publish required.

**Step 2 — Select a value and submit** (or trigger whatever interaction populates the field).

**Step 3 — Check the Variables panel** for the new Custom JavaScript variable's resolved value — it should show the actual selected text, not an empty string.

**Step 4 — Confirm in the tag's resolved parameters**, either in the live panel or a JSON export, that the correct value is what's actually being sent.

A quick note on the old DOM Element variable: a blank Attribute Name falls back to reading the element's text content rather than an attribute, which can coincidentally return the right string if the option's visible text and its `value` attribute happen to be identical. That's fragile — it breaks the moment they diverge (e.g. `<option value="lawn-mowing">Lawn Mowing</option>`). The Custom JavaScript variable is the correct fix regardless of how the markup is structured.

---

*A GA4 parameter sending blank is rarely the trigger or the tag — it's almost always the variable reading the wrong representation of the data. We audit every variable in your container against what it's actually supposed to capture. [Get a diagnostic.](/#contact)*
