# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-useragent@2.0.1...@ima/plugin-useragent@3.0.0) (2020-06-08)


### Features

* 🎸  Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))





# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.0.1 - 2020-02-19
### Changed
- FIXING PREVIOUS VERSION (2.0.0) which was accidentally released without all desired changes because a problem during releasing it.

## 2.0.0 - 2020-02-18
### Changed
- DO NOT USE THIS VERSION - there was a problem during releasing this version which caused that this version was released without all desired changes - it is fixed in the next version (2.0.1) of this plugin. Original text of this version: SznProhlizec (Seznam prohlížeč/sBrowser) - browser from the Seznam.cz (https://www.seznam.cz/prohlizec/) - is newly recognized and parsed correctly. The `getName()` method now returns the `SznProhlizec` string and the `getVersion()` method returns the version of the SznProhlizec in a string. Previously the SznProhlizec was parsed as a different browser depending on where the SznProhlizec runs (desktop, Android app, iOS app) - e.g. the actually newest SznProhlizec version 7.3 on iPhone XR with iOS 13.3.1 was parsed as really old Safari 8 - this wrong parsing of the SznProhlizec could cause some errors and problems in this browser in functionality which depends on browser and its version.

## 2.0.0 - 2020-02-18
### Changed
- SznProhlizec (Seznam prohlížeč/sBrowser) - browser from the Seznam.cz (https://www.seznam.cz/prohlizec/) - is newly recognized and parsed correctly. The `getName()` method now returns the `SznProhlizec` string and the `getVersion()` method returns the version of the SznProhlizec in a string. Previously the SznProhlizec was parsed as a different browser depending on where the SznProhlizec runs (desktop, Android app, iOS app) - e.g. the actually newest SznProhlizec version 7.3 on iPhone XR with iOS 13.3.1 was parsed as really old Safari 8 - this wrong parsing of the SznProhlizec could cause some errors and problems in this browser in functionality which depends on browser and its version.

## 1.0.0 - 2019-11-28
### Removed
- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+
