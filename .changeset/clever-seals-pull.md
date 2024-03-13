---
"@ima/plugin-analytic-google": major
---

Update data sent in a GA4 page view hit

**What:** Add the prefix `page_` to the existing params (these are the correct default names for GA4) and add new parameters. Save `referrer` to correspond to the actual referrer in SPA browsing. Add missing consent settings.
**Why:** We were hitting page view incorrectly.
**How:** Nothing.
