# Change Log

## 4.0.6

### Patch Changes

- 7e0c93b: Fix displayName value for components wrapped with `select` HOC. This should resolve the issue with `Component.displayName` being `withContext(undefined)`.

## 4.0.5

### Patch Changes

- 8f5d01a: Fixed build issues with client server config

## 4.0.4

### Patch Changes

- 9bb70b3: New component created from forwardedSelect or default import hoist non react static methods from original component.

## 4.0.3

### Patch Changes

- 110c2af: Removed invalid RC version ranges in package.json files

## 4.0.2

### Patch Changes

- 37c3f2f: Udpated dependencies to support RC ima versions
- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps
- d08218b: Added type declarations generated from JSdoc
- 6d47aaa: Side effects notation from package.json
- 5717869: Added $dependencies typing comments for TS apps

## 4.0.2-rc.4

### Patch Changes

- 5717869: Added $dependencies typing comments for TS apps

## 4.0.2-rc.3

### Patch Changes

- 6d47aaa: Side effects notation from package.json

## 4.0.2-rc.2

### Patch Changes

- d08218b: Added type declarations generated from JSdoc

## 4.0.2-rc.1

### Patch Changes

- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps

## 4.0.2-rc.0

### Patch Changes

- 37c3f2f: Udpated dependencies to support RC ima versions

## 4.0.1

### Patch Changes

- dd4dd52: Updated to latest @ima/plugin-cli - the final bundle now contains new styles folder containing all less/css files and they are no longer bundled into esm bundle

## 4.0.0

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

- f0e7879: Fixed package type for commonjs CLI packages
  Update plugin-cli with fixes for jsx built files, where the extension was not normalized
- 431ad38: Fixed node config packages
- 1c61a6d: Automatic JSX runtime, deps update
- f7fe41d: Updated to latest version of plugin-cli
- 15e981a: Updated plugin-cli to latest version
- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge
- 9bf6acf: @ima/plugin-cli version bump
- 1a6651d: Migrated to react-page-renderer

## 4.0.0-rc.11

### Patch Changes

- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge

## 4.0.0-rc.10

### Patch Changes

- 1c61a6d: Automatic JSX runtime, deps update

## 4.0.0-rc.9

### Patch Changes

- 9bf6acf: @ima/plugin-cli version bump

## 4.0.0-rc.8

### Patch Changes

- 15e981a: Updated plugin-cli to latest version

## 4.0.0-rc.7

### Patch Changes

- 1a6651d: Migrated to react-page-renderer

## 4.0.0-rc.6

### Patch Changes

- 431ad38: Fixed node config packages

## 4.0.0-rc.5

### Patch Changes

- f7fe41d: Updated to latest version of plugin-cli

## 4.0.0-rc.4

### Major Changes

- 5149e99: Added additional CJS builds to npm dist directory

## 4.0.0-rc.3

### Patch Changes

- f0e7879: Fixed package type for commonjs CLI packages
  Update plugin-cli with fixes for jsx built files, where the extension was not normalized

## 4.0.0-rc.2

### Major Changes

- fb1a51e: Migrated packages to pure esm modules

## 4.0.0-rc.1

### Minor Changes

- 0b81d28: npmignore revert logic, add missing npmignore
  apply pluginLoader
  update ima peer deps
  refactor plugin register functions, remove exports for ima17

## 4.0.0-rc.0

### Major Changes

- 1256647: Add support for IMA 18, Node 18 and npm 8

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@3.3.1...@ima/plugin-select@3.3.2) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-select

## [3.3.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@3.3.0...@ima/plugin-select@3.3.1) (2022-01-10)

**Note:** Version bump only for package @ima/plugin-select

# [3.3.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@3.2.0...@ima/plugin-select@3.3.0) (2021-12-13)

### Features

- 🎸 add npm 8 support ([#57](https://github.com/seznam/IMA.js-plugins/issues/57)) ([e671a3f](https://github.com/seznam/IMA.js-plugins/commit/e671a3fb8d87c39c2da43339782fdca4bf78375d))

# [3.2.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@3.1.2...@ima/plugin-select@3.2.0) (2021-08-26)

### Features

- 🎸 add node16 and npm7 support ([#49](https://github.com/seznam/IMA.js-plugins/issues/49)) ([16fcc0e](https://github.com/seznam/IMA.js-plugins/commit/16fcc0eab73da5651171d110100e5a5ec9cbdcf1))

## [3.1.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@3.1.1...@ima/plugin-select@3.1.2) (2021-06-02)

### Bug Fixes

- 🐛 resolve new selected state after new props is passed ([#48](https://github.com/seznam/IMA.js-plugins/issues/48)) ([53fc087](https://github.com/seznam/IMA.js-plugins/commit/53fc087e64aba904d28add03a5851e9ab31ba79b))

## [3.1.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@3.1.0...@ima/plugin-select@3.1.1) (2021-05-20)

### Bug Fixes

- 🐛 backward compatibility with passing props \$Utils ([858ad5f](https://github.com/seznam/IMA.js-plugins/commit/858ad5f37c5f89d82d41cacffddc7c96ec14efbb))

# [3.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@3.0.0...@ima/plugin-select@3.1.0) (2021-05-09)

### Features

- 🎸 add useSelect hook ([3e6247a](https://github.com/seznam/IMA.js-plugins/commit/3e6247a0a57f0481a76f0bdc3497f9f40385d79b))

# [3.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@2.0.3...@ima/plugin-select@3.0.0) (2021-04-23)

### Features

- 🎸 Select can replace props instead of only addition ([#45](https://github.com/seznam/IMA.js-plugins/issues/45)) ([7853aa6](https://github.com/seznam/IMA.js-plugins/commit/7853aa6f247ca3bca0858317ac9fc0ea505fed41))

### BREAKING CHANGES

- 🧨 Select can replace props instead of only addition

Co-authored-by: Zdeněk Laštůvka <zdenek.lastuvka@firma.seznam.cz>

## [2.0.3](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@2.0.2...@ima/plugin-select@2.0.3) (2021-03-22)

**Note:** Version bump only for package @ima/plugin-select

## [2.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@2.0.1...@ima/plugin-select@2.0.2) (2020-10-01)

### Bug Fixes

- 🐛 clear memoized selector for different state keys ([b38c44f](https://github.com/seznam/IMA.js-plugins/commit/b38c44f116704a15ddc391aab06403da79c77fa9))

## [2.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@2.0.0...@ima/plugin-select@2.0.1) (2020-06-22)

### Bug Fixes

- 🐛 edge doesn't support rest operator fo object ([c80ce8c](https://github.com/seznam/IMA.js-plugins/commit/c80ce8cf78e3cc4984b6f178c14b3718e4a0591e))

# [2.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-select@1.1.1...@ima/plugin-select@2.0.0) (2020-06-08)

### Features

- 🎸 Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))

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
