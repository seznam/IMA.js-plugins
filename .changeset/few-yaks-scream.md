---
"@ima/plugin-analytic-fb-pixel": major
"@ima/plugin-analytic-google": major
---

Update to new version of @cns/plugin-analytic

- **What?**
  - Update to new version of [@cns/plugin-analytic](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-analytic), which requires to save `config` argument to class variable.
  - Config is now first in dependencies list
- **Why?** Adding dependencies to subclasses is easier (no need to copy all dependencies, more info [here](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-analytic/CHANGELOG.md#600))
- **How?** If you extend `FacebookPixelAnalytic` or `GoogleAnalytics4` you need to move `config` parameter to the first position, when calling its `constructor`,
