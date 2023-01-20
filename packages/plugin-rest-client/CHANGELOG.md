# Change Log

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

- 431ad38: Fixed node config packages
- 1c61a6d: Automatic JSX runtime, deps update
- f7fe41d: Updated to latest version of plugin-cli
- 15e981a: Updated plugin-cli to latest version
- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge
- 9bf6acf: @ima/plugin-cli version bump
- 1a6651d: Migrated to react-page-renderer

## 4.0.0-rc.10

### Patch Changes

- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge

## 4.0.0-rc.9

### Patch Changes

- 1c61a6d: Automatic JSX runtime, deps update

## 4.0.0-rc.8

### Patch Changes

- 9bf6acf: @ima/plugin-cli version bump

## 4.0.0-rc.7

### Patch Changes

- 15e981a: Updated plugin-cli to latest version

## 4.0.0-rc.6

### Patch Changes

- 1a6651d: Migrated to react-page-renderer

## 4.0.0-rc.5

### Patch Changes

- 431ad38: Fixed node config packages

## 4.0.0-rc.4

### Patch Changes

- f7fe41d: Updated to latest version of plugin-cli

## 4.0.0-rc.3

### Major Changes

- 5149e99: Added additional CJS builds to npm dist directory

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

## [3.2.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-rest-client@3.2.1...@ima/plugin-rest-client@3.2.2) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-rest-client

## [3.2.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-rest-client@3.2.0...@ima/plugin-rest-client@3.2.1) (2022-01-10)

**Note:** Version bump only for package @ima/plugin-rest-client

# [3.2.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-rest-client@3.1.0...@ima/plugin-rest-client@3.2.0) (2021-12-13)

### Features

- 🎸 add npm 8 support ([#57](https://github.com/seznam/IMA.js-plugins/issues/57)) ([e671a3f](https://github.com/seznam/IMA.js-plugins/commit/e671a3fb8d87c39c2da43339782fdca4bf78375d))

# [3.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-rest-client@3.0.2...@ima/plugin-rest-client@3.1.0) (2021-08-26)

### Features

- 🎸 add node16 and npm7 support ([#49](https://github.com/seznam/IMA.js-plugins/issues/49)) ([16fcc0e](https://github.com/seznam/IMA.js-plugins/commit/16fcc0eab73da5651171d110100e5a5ec9cbdcf1))

## [3.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-rest-client@3.0.1...@ima/plugin-rest-client@3.0.2) (2021-03-22)

**Note:** Version bump only for package @ima/plugin-rest-client

## [3.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-rest-client@3.0.0...@ima/plugin-rest-client@3.0.1) (2020-06-22)

**Note:** Version bump only for package @ima/plugin-rest-client

# [3.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-rest-client@2.0.0...@ima/plugin-rest-client@3.0.0) (2020-06-08)

### Features

- 🎸 Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.0.0 - 2020-02-07

### Changed

- **BREAKING CHANGE!** - `AbstractEntity` has not dependency on REST API client. All REST API method calls from the `AbstractEntity` was removed.

### Added

- Added `AbstractResource` which now contains all rest API call methods that has been extracted from the `AbstractEntity`

## 1.0.5 - 2019-12-10

### Fixed

- Fixed package build

## 1.0.4 - 2019-12-09

### Added

- Added `deepFreeze` to exports

## 1.0.3 - 2019-12-06

### Fixed

- Fix package build

## 1.0.2 - 2019-12-06

### Changed

- Switched to name exports instead of accessing specific files directly (i.e. `import RestClient from '@ima/plugin-rest-client/RestClient'` -> `import { RestClient } from '@ima/plugin-rest-client'`)

## 1.0.1 - 2019-12-06

### Fixed

- Fix package build

## 1.0.0 - 2019-10-23

### Removed

- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+
