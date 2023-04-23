# Change Log

## 3.0.2-rc.4

### Patch Changes

- 5717869: Added $dependencies typing comments for TS apps

## 3.0.2-rc.3

### Patch Changes

- 6d47aaa: Side effects notation from package.json

## 3.0.2-rc.2

### Patch Changes

- d08218b: Added type declarations generated from JSdoc

## 3.0.2-rc.1

### Patch Changes

- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps

## 3.0.2-rc.0

### Patch Changes

- 37c3f2f: Udpated dependencies to support RC ima versions

## 3.0.1

### Patch Changes

- dd4dd52: Updated to latest @ima/plugin-cli - the final bundle now contains new styles folder containing all less/css files and they are no longer bundled into esm bundle

## 3.0.0

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

## 3.0.0-rc.10

### Patch Changes

- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge

## 3.0.0-rc.9

### Patch Changes

- 1c61a6d: Automatic JSX runtime, deps update

## 3.0.0-rc.8

### Patch Changes

- 9bf6acf: @ima/plugin-cli version bump

## 3.0.0-rc.7

### Patch Changes

- 15e981a: Updated plugin-cli to latest version

## 3.0.0-rc.6

### Patch Changes

- 1a6651d: Migrated to react-page-renderer

## 3.0.0-rc.5

### Patch Changes

- 431ad38: Fixed node config packages

## 3.0.0-rc.4

### Patch Changes

- f7fe41d: Updated to latest version of plugin-cli

## 3.0.0-rc.3

### Major Changes

- 5149e99: Added additional CJS builds to npm dist directory

## 3.0.0-rc.2

### Major Changes

- fb1a51e: Migrated packages to pure esm modules

## 3.0.0-rc.1

### Minor Changes

- 0b81d28: npmignore revert logic, add missing npmignore
  apply pluginLoader
  update ima peer deps
  refactor plugin register functions, remove exports for ima17

## 3.0.0-rc.0

### Major Changes

- 1256647: Add support for IMA 18, Node 18 and npm 8

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@2.1.1...@ima/plugin-local-storage@2.1.2) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-local-storage

## [2.1.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@2.1.0...@ima/plugin-local-storage@2.1.1) (2022-01-10)

**Note:** Version bump only for package @ima/plugin-local-storage

# [2.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@2.0.2...@ima/plugin-local-storage@2.1.0) (2021-08-26)

### Features

- 🎸 add node16 and npm7 support ([#49](https://github.com/seznam/IMA.js-plugins/issues/49)) ([16fcc0e](https://github.com/seznam/IMA.js-plugins/commit/16fcc0eab73da5651171d110100e5a5ec9cbdcf1))

## [2.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@2.0.1...@ima/plugin-local-storage@2.0.2) (2021-03-22)

**Note:** Version bump only for package @ima/plugin-local-storage

## [2.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@2.0.0...@ima/plugin-local-storage@2.0.1) (2020-06-22)

**Note:** Version bump only for package @ima/plugin-local-storage

# [2.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-local-storage@1.0.2...@ima/plugin-local-storage@2.0.0) (2020-06-08)

### Features

- 🎸 Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))

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
