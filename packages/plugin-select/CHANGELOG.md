# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@2.0.0...@ima/plugin-select@2.0.1) (2020-06-22)


### Bug Fixes

* 🐛 edge doesn't support rest operator fo object ([c80ce8c](https://github.com/seznam/IMA.js-plugins/commit/c80ce8cf78e3cc4984b6f178c14b3718e4a0591e))





# [2.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@1.1.1...@ima/plugin-select@2.0.0) (2020-06-08)


### Features

* 🎸  Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))





# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.1.1 - 2020-05-13
### Fixed
- Fixed warning when using npm 6+

## 1.1.0 - 2019-04-08
### Fixed
- Re-run selectors when "own" props change. This is for cases where data coming from selectors depends on given props.

## 1.0.1 - 2019-12-02
### Fixed
- Import of StateEvents from @ima/core

### Changed
- `import { select } from '@ima/plugin-select'` will no longer import forwardedRef, but directly the select react element

## 1.0.0 - 2019-11-28
### Removed
- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+

## 0.16.1 - 2019-11-18
### Fixed
- Fixed syntax for Edge browser.

## 0.16.0 - 2019-11-07
### Added
- Added `ref` forwarding – `ref` is passed to the component.

## 0.15.3 - 2019-11-01
### Added
- Added `ownProps` (props passed to component) as a 3rd argument to state selectors.

## 0.15.2 - 2019-09-04
### Added
- Added global configurable method `setHoistStaticMethod`
- Exported hoistNonReactStatic method from hoist-non-react-statics module
