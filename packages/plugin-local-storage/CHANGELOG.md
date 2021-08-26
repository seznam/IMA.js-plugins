# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@2.0.2...@ima/plugin-local-storage@2.1.0) (2021-08-26)


### Features

* 🎸 add node16 and npm7 support ([#49](https://github.com/seznam/IMA.js-plugins/issues/49)) ([16fcc0e](https://github.com/seznam/IMA.js-plugins/commit/16fcc0eab73da5651171d110100e5a5ec9cbdcf1))





## [2.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@2.0.1...@ima/plugin-local-storage@2.0.2) (2021-03-22)

**Note:** Version bump only for package @ima/plugin-local-storage





## [2.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@2.0.0...@ima/plugin-local-storage@2.0.1) (2020-06-22)

**Note:** Version bump only for package @ima/plugin-local-storage





# [2.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@1.0.2...@ima/plugin-local-storage@2.0.0) (2020-06-08)


### Features

* 🎸  Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))





# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.0.2 - 2019-02-04
### Fixed
- Fixed issue when has returned false for false and null values. Not it returns false only for undefined.

## 1.0.1 - 2019-02-04
### Fixed
- Fixed issue when getting false, undefined or null values from localstorage always resolved to undefined.

## 1.0.0 - 2019-11-28
### Removed
- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+
