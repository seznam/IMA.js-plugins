# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.2.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.1.0...@ima/plugin-analytic-google@5.2.0) (2022-11-29)


### Bug Fixes

* 🐛 default settings for GA4 ([28aad6b](https://github.com/seznam/IMA.js-plugins/commit/28aad6b709c660b3c28d9edefdfcd3d005a893fb))
* 🐛 GA4 hit method for custom events ([ef58d98](https://github.com/seznam/IMA.js-plugins/commit/ef58d9888720b41963b2d869e7057618d634a006))
* 🐛 manage consents on our own ([b6ce79c](https://github.com/seznam/IMA.js-plugins/commit/b6ce79c7e26899ebbb7d41c8edbffb6dc99b8124))
* 🐛 move GoogleAnalytics4 to plugin-analytic-google ([ff0ae06](https://github.com/seznam/IMA.js-plugins/commit/ff0ae06b9dbce136ecbc1a535ec3397d61d28475))
* 🐛 updateConsent method and tests ([c68e249](https://github.com/seznam/IMA.js-plugins/commit/c68e24908d1b790abab54b59bd993367f00f7daa))





# [5.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.0.2...@ima/plugin-analytic-google@5.1.0) (2022-01-12)


### Features

* 🎸 new _getPageViewData method for better override ([d700df2](https://github.com/seznam/IMA.js-plugins/commit/d700df21bd982b94e93f62ed40114e458d43a3bf))
* 🎸 new _getPageViewData method for better override ([9a30328](https://github.com/seznam/IMA.js-plugins/commit/9a303281af56830a7489f31bcbaf0b1de41e0349))





## [5.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.0.1...@ima/plugin-analytic-google@5.0.2) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-analytic-google





## [5.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.0.0...@ima/plugin-analytic-google@5.0.1) (2022-01-10)

**Note:** Version bump only for package @ima/plugin-analytic-google





# [5.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@4.1.0...@ima/plugin-analytic-google@5.0.0) (2021-12-13)


### Features

* 🎸 respects GDPR - purpose 1 ([#58](https://github.com/seznam/IMA.js-plugins/issues/58)) ([d792e91](https://github.com/seznam/IMA.js-plugins/commit/d792e91323184aa18d734131955c1ea8787afab2))


### BREAKING CHANGES

* 🧨 tracking is disabled by default, use purposeConsents in initConfig
object to set users consents





# [4.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@4.0.2...@ima/plugin-analytic-google@4.1.0) (2021-08-26)


### Features

* 🎸 add node16 and npm7 support ([#49](https://github.com/seznam/IMA.js-plugins/issues/49)) ([16fcc0e](https://github.com/seznam/IMA.js-plugins/commit/16fcc0eab73da5651171d110100e5a5ec9cbdcf1))





## [4.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@4.0.1...@ima/plugin-analytic-google@4.0.2) (2020-07-07)


### Bug Fixes

* 🐛  build bundle to contain all required files ([3734f31](https://github.com/seznam/IMA.js-plugins/commit/3734f31f02ca5e81d0f8f0ad8b46d0f6560f3c4e))





## [4.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@4.0.0...@ima/plugin-analytic-google@4.0.1) (2020-06-22)

**Note:** Version bump only for package @ima/plugin-analytic-google





# [4.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@3.0.0...@ima/plugin-analytic-google@4.0.0) (2020-06-08)


### Features

* 🎸  Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))





# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.0.0 - 2019-11-28
### Removed
- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+
