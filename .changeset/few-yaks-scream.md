---
"@ima/plugin-analytic-fb-pixel": major
"@ima/plugin-analytic-google": major
---

Update to new version of @ima/plugin-analytic

- **What?**
  - Update to new version of [@ima/plugin-analytic](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-analytic), which doesn't save `config` argument to class variable anymore.
  - Config was moved to first position in dependencies list
  - Removed `defaultDependencies` export.
  - Typescriptization
- **Why?**
  - Adding dependencies to subclasses is easier (no need to copy all dependencies, more info in @ima/plugin-analytic [CHANGELOG](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-analytic/CHANGELOG.md#600))
  - `defaultDependencies` was weird pattern, and we want to get rid of it
- **How?**
  - If you extend `FacebookPixelAnalytic` or `GoogleAnalytics4` you need to move `config` parameter to the first position, when calling its `constructor`.
  - Replace use of `defaultDependencies` by `$dependencies` property of given class plugin class.
  
  **!!** Use only with **@ima/plugin-analytic@6.0.0** or newer. **!!**
