---
layout: default
title: About
description: One technical operator, not an agency. Conversion tracking for local service businesses running Google Ads.
permalink: /about/
---

<section class="pt-16 pb-2">
  <div class="max-w-6xl mx-auto px-5 md:px-7 max-w-prose">
    <h1 class="text-[clamp(2rem,4.4vw,3rem)] leading-tight">One operator, not an agency</h1>
    <div class="stripe-rule" role="presentation"></div>
    <p class="text-[1.14rem] text-slate">
      Brad Hamilton checks the tracking himself. There's no account manager, no
      team you never speak to, and nobody to hand your account off to.
    </p>
  </div>
</section>

<div class="max-w-6xl mx-auto px-5 md:px-7 pb-14 md:pb-[72px]">
<div class="max-w-prose prose-headings:tracking-tight">

<div class="verify-box mb-8">
<span class="font-mono text-[.72rem] block mb-2">CONFIRM BEFORE LAUNCH</span>
The copy below states experience as <code class="font-mono">{{ site.years_experience }}</code>,
set in <code class="font-mono">_config.yml</code>. Unlike the claims removed from the old
site, this one is your own verifiable work history — settle on the exact figure you're
comfortable defending publicly and set it as a specific number rather than a range,
then delete this block.
</div>

## Why a systems engineer ended up doing this

I spent {{ site.years_experience }} in systems engineering before any of this — the
work of finding out why something that should be running isn't, in environments where
nobody left a note about what changed. Broken conversion tracking is the same problem
wearing different clothes. Something in a chain of four handoffs stopped working, the
system reports success anyway, and the only way through is to test each link until one
fails.

That's why the diagnostic here is a sequence rather than a checklist. Most people who
work on tracking start clicking around in Tag Manager and stop when something looks
plausible. A conversion has to survive four separate steps, and it can die at any one
of them, so the only reliable method is to test them in order.

## Why local service businesses specifically

Because the gap between reported and real is widest there, and it costs the most.

An e-commerce store notices broken tracking fairly quickly — revenue and orders are
easy to reconcile. A contractor running Google Ads has no such loop. Jobs get booked
over the phone, written on a board, invoiced from a truck. Nothing automatically
compares that to what Google Ads claims happened. So the gap sits there, quietly, and
every budget decision gets made against the wrong number.

That's a problem worth being specific about, which is why this site isn't for
everyone. If you're a multi-location brand with an analytics team, you don't need me.

## How the work actually goes

Async by default. You don't need to take a call to start, and I won't ask for one to
close. Fixed prices, quoted before anything begins. Support hours are
{{ site.support_hours }} — stated plainly because a vague "we respond fast" promise is
worth nothing to someone deciding whether to trust a stranger with account access.

If I can tell you the fix in a sentence, I'll tell you the fix in a sentence, and you
can go do it yourself. That happens reasonably often and it's fine.

## What I don't do

I don't manage Google Ads campaigns, write ad copy, or advise on bids. I make sure the
numbers those decisions rest on are real. Plenty of people do the campaign side well;
far fewer check whether the measurement underneath it works.

</div>
</div>

{% include contact-form.html %}
