---
layout: default
title: Results
description: Before-and-after conversion tracking results from local service businesses, shared with permission.
permalink: /results/
sitemap: false
---

<section class="pt-16 pb-2">
  <div class="max-w-6xl mx-auto px-5 md:px-7 max-w-prose">
    <h1 class="text-[clamp(2rem,4.4vw,3rem)] leading-tight">Results</h1>
    <div class="stripe-rule" role="presentation"></div>
    <p class="text-[1.14rem] text-slate">
      Before-and-after numbers from real accounts, published with the client's
      permission and using their own records.
    </p>
  </div>
</section>

{% include results.html %}

<section class="py-14 md:py-[72px]">
  <div class="max-w-6xl mx-auto px-5 md:px-7">
    <div class="verify-box max-w-measure">
      <span class="font-mono text-[.72rem] block mb-2">NOT LINKED IN NAVIGATION YET</span>
      This page is live but deliberately excluded from the sitemap
      (<code class="font-mono">sitemap: false</code>) and absent from the nav until at
      least one real case study exists in <code class="font-mono">_data/case_studies.yml</code>.
      Add the entry, delete this block, remove the <code class="font-mono">sitemap: false</code>
      line, and add the nav link in <code class="font-mono">_layouts/default.html</code>.
    </div>
  </div>
</section>

{% include contact-form.html %}
