# Bug-to-Blog Initiative

Decision made 2026-10-13: real GTM/GA4 bugs found during hands-on learning on the
`bookedoutsolid.com` sandbox get captured in a living problem/solution database
(Claude Project doc `claude/bug-problem-solution-database.md`) and turned into
individual, non-overlapping public posts here — one problem, one page.

Full write-up of the decision, rationale, and running status lives in Obsidian:
`GTMSetupService/updates/bug-to-blog-pipeline.md`. This file is a pointer for
anyone (including future-me) working in this repo who wants the context without
leaving the codebase.

Rules for posts coming out of this pipeline:
- No mention of "Day X," "sandbox," "Dojo," "lesson," or "training" anywhere in
  the published post. The bugs are real; the posts read as real production
  debugging experience.
- Must not overlap the 8 posts already live — check `docs/content-plan-q2-2026.md`
  and `_posts/` before writing a new one.
- Follow the existing post template exactly: direct-answer opener, dual
  anchor-linked TOC ("What You're Seeing" / "The Fix"), FAQ front matter,
  problem_layer/fix_method metadata.

First post drafted same day: `_posts/2026-10-13-gtm-click-trigger-not-firing-css-selector-fix.md`
(CSS selector syntax bug on Click triggers). Needs a real `featured_image` asset
before publishing — placeholder path only.
