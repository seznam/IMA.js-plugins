---
"@ima/plugin-analytic-google": patch
---

Correct GTM params

- **What?** Push correct data format to Google Tag Manager `dataLayer`.
- **Why?** Otherwise the GA4 events are not hit. GTM needs the params in the `Arguments` array-like object - not object, not array.
- **How?** Nothing.
