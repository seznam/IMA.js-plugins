# Change Log

## 7.0.3

### Patch Changes

- 8f5d01a: Fixed build issues with client server config

## 7.0.2

### Patch Changes

- e2eeb2b: Turbo, eslint update, types exports, new tsconfig

## 7.0.1

### Patch Changes

- 6d92917: Code refactorings, moved type extensions to separate file to cleanup main.ts
- Updated dependencies [535f56e]
- Updated dependencies [6d92917]
  - @ima/plugin-script-loader@4.0.0

## 7.0.0

### Major Changes

- 418df00: **BREAKING CHANGE** Support for Google Analytics UA was dropped, use GA4 instead.

## 6.0.3

### Patch Changes

- 110c2af: Removed invalid RC version ranges in package.json files

## 6.0.2

### Patch Changes

- de5b640: Added plugin settings exports
- 37c3f2f: Udpated dependencies to support RC ima versions
- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps
- d08218b: Added type declarations generated from JSdoc
- 6d47aaa: Side effects notation from package.json
- 5717869: Added $dependencies typing comments for TS apps

## 6.0.2-rc.5

### Patch Changes

- de5b640: Added plugin settings exports

## 6.0.2-rc.4

### Patch Changes

- 5717869: Added $dependencies typing comments for TS apps

## 6.0.2-rc.3

### Patch Changes

- 6d47aaa: Side effects notation from package.json

## 6.0.2-rc.2

### Patch Changes

- d08218b: Added type declarations generated from JSdoc

## 6.0.2-rc.1

### Patch Changes

- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps
- Updated dependencies [2e61a48]
  - @ima/plugin-analytic@5.0.2-rc.0
  - @ima/plugin-script-loader@3.1.1-rc.0

## 6.0.2-rc.0

### Patch Changes

- 37c3f2f: Udpated dependencies to support RC ima versions

## 6.0.1

### Patch Changes

- dd4dd52: Updated to latest @ima/plugin-cli - the final bundle now contains new styles folder containing all less/css files and they are no longer bundled into esm bundle

## 6.0.0

### Major Changes

- fb1a51e: Migrated packages to pure esm modules
- 5149e99: Added additional CJS builds to npm dist directory
- 1256647: Add support for IMA 18, Node 18 and npm 8

### Minor Changes

- 0b81d28: npmignore revert logic, add missing npmignore
  apply pluginLoader
  update ima peer deps
  refactor plugin register functions, remove exports for ima17

### Patch Changes

- 431ad38: Fixed node config packages
- 1c61a6d: Automatic JSX runtime, deps update
- f7fe41d: Updated to latest version of plugin-cli
- 15e981a: Updated plugin-cli to latest version
- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge
- 9bf6acf: @ima/plugin-cli version bump
- 1a6651d: Migrated to react-page-renderer
- Updated dependencies [431ad38]
- Updated dependencies [fb1a51e]
- Updated dependencies [1c61a6d]
- Updated dependencies [5149e99]
- Updated dependencies [f7fe41d]
- Updated dependencies [15e981a]
- Updated dependencies [df68488]
- Updated dependencies [1256647]
- Updated dependencies [113952b]
- Updated dependencies [9bf6acf]
- Updated dependencies [1a6651d]
- Updated dependencies [0b81d28]
  - @ima/plugin-analytic@5.0.0
  - @ima/plugin-script-loader@3.0.0

## 6.0.0-rc.10

### Patch Changes

- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge

## 6.0.0-rc.9

### Patch Changes

- 1c61a6d: Automatic JSX runtime, deps update

## 6.0.0-rc.8

### Patch Changes

- 9bf6acf: @ima/plugin-cli version bump

## 6.0.0-rc.7

### Patch Changes

- 15e981a: Updated plugin-cli to latest version

## 6.0.0-rc.6

### Patch Changes

- 1a6651d: Migrated to react-page-renderer

## 6.0.0-rc.5

### Patch Changes

- 431ad38: Fixed node config packages

## 6.0.0-rc.4

### Patch Changes

- f7fe41d: Updated to latest version of plugin-cli

## 6.0.0-rc.3

### Major Changes

- 5149e99: Added additional CJS builds to npm dist directory

### Patch Changes

- Updated dependencies [5149e99]
  - @ima/plugin-analytic@5.0.0-rc.3
  - @ima/plugin-script-loader@3.0.0-rc.3

## 6.0.0-rc.2

### Major Changes

- fb1a51e: Migrated packages to pure esm modules

### Patch Changes

- Updated dependencies [fb1a51e]
  - @ima/plugin-analytic@5.0.0-rc.2
  - @ima/plugin-script-loader@3.0.0-rc.2

## 6.0.0-rc.1

### Minor Changes

- 0b81d28: npmignore revert logic, add missing npmignore
  apply pluginLoader
  update ima peer deps
  refactor plugin register functions, remove exports for ima17

### Patch Changes

- Updated dependencies [0b81d28]
  - @ima/plugin-analytic@5.0.0-rc.1
  - @ima/plugin-script-loader@3.0.0-rc.1

## 6.0.0-rc.0

### Major Changes

- 1256647: Add support for IMA 18, Node 18 and npm 8

### Patch Changes

- Updated dependencies [1256647]
  - @ima/plugin-analytic@5.0.0-rc.0
  - @ima/plugin-script-loader@3.0.0-rc.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.2.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.2.0...@ima/plugin-analytic-google@5.2.1) (2022-12-08)

**Note:** Version bump only for package @ima/plugin-analytic-google

# [5.2.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.1.0...@ima/plugin-analytic-google@5.2.0) (2022-11-29)

### Features

- 🎸 Google Analytics 4 implementation ([092ef19](https://github.com/seznam/IMA.js-plugins/commit/092ef19fceee71bc50f0ecebb674bcd7bbeae2a3))

# [5.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.0.2...@ima/plugin-analytic-google@5.1.0) (2022-01-12)

### Features

- 🎸 new \_getPageViewData method for better override ([d700df2](https://github.com/seznam/IMA.js-plugins/commit/d700df21bd982b94e93f62ed40114e458d43a3bf))
- 🎸 new \_getPageViewData method for better override ([9a30328](https://github.com/seznam/IMA.js-plugins/commit/9a303281af56830a7489f31bcbaf0b1de41e0349))

## [5.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.0.1...@ima/plugin-analytic-google@5.0.2) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-analytic-google

## [5.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@5.0.0...@ima/plugin-analytic-google@5.0.1) (2022-01-10)

**Note:** Version bump only for package @ima/plugin-analytic-google

# [5.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@4.1.0...@ima/plugin-analytic-google@5.0.0) (2021-12-13)

### Features

- 🎸 respects GDPR - purpose 1 ([#58](https://github.com/seznam/IMA.js-plugins/issues/58)) ([d792e91](https://github.com/seznam/IMA.js-plugins/commit/d792e91323184aa18d734131955c1ea8787afab2))

### BREAKING CHANGES

- 🧨 tracking is disabled by default, use purposeConsents in initConfig
  object to set users consents

# [4.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@4.0.2...@ima/plugin-analytic-google@4.1.0) (2021-08-26)

### Features

- 🎸 add node16 and npm7 support ([#49](https://github.com/seznam/IMA.js-plugins/issues/49)) ([16fcc0e](https://github.com/seznam/IMA.js-plugins/commit/16fcc0eab73da5651171d110100e5a5ec9cbdcf1))

## [4.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@4.0.1...@ima/plugin-analytic-google@4.0.2) (2020-07-07)

### Bug Fixes

- 🐛 build bundle to contain all required files ([3734f31](https://github.com/seznam/IMA.js-plugins/commit/3734f31f02ca5e81d0f8f0ad8b46d0f6560f3c4e))

## [4.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@4.0.0...@ima/plugin-analytic-google@4.0.1) (2020-06-22)

**Note:** Version bump only for package @ima/plugin-analytic-google

# [4.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic-google@3.0.0...@ima/plugin-analytic-google@4.0.0) (2020-06-08)

### Features

- 🎸 Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.0.0 - 2019-11-28

### Removed

- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+
