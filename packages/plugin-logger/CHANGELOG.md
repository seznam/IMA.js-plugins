# Change Log

## 5.0.0-rc.9

### Patch Changes

- 15e981a: Updated plugin-cli to latest version

## 5.0.0-rc.8

### Patch Changes

- 1a6651d: Migrated to react-page-renderer

## 5.0.0-rc.7

### Patch Changes

- 431ad38: Fixed node config packages

## 5.0.0-rc.6

### Patch Changes

- f7fe41d: Updated to latest version of plugin-cli

## 5.0.0-rc.5

### Patch Changes

- 1b21edc: Fixed invalid exports on logger function

## 5.0.0-rc.4

### Patch Changes

- 71d51f0: Fixed entry points

## 5.0.0-rc.3

### Major Changes

- 5149e99: Added additional CJS builds to npm dist directory

## 5.0.0-rc.2

### Major Changes

- fb1a51e: Migrated packages to pure esm modules

## 5.0.0-rc.1

### Minor Changes

- 0b81d28: npmignore revert logic, add missing npmignore
  apply pluginLoader
  update ima peer deps
  refactor plugin register functions, remove exports for ima17

## 5.0.0-rc.0

### Major Changes

- 1256647: Add support for IMA 18, Node 18 and npm 8

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-logger@3.0.3...@ima/plugin-logger@4.0.0) (2022-01-18)

### Code Refactoring

- 💡 change module.exports to ES module export ([7b24325](https://github.com/seznam/IMA.js-plugins/commit/7b24325dc1675e6161812f137b613e724e6c99e2))

### BREAKING CHANGES

- 🧨 The module file is transformed from ES module to commonjs only from
  rollup's build.

## [3.0.3](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-logger@3.0.2...@ima/plugin-logger@3.0.3) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-logger

## [3.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-logger@3.0.1...@ima/plugin-logger@3.0.2) (2022-01-10)

**Note:** Version bump only for package @ima/plugin-logger

## [3.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-logger@3.0.0...@ima/plugin-logger@3.0.1) (2020-06-22)

**Note:** Version bump only for package @ima/plugin-logger

# [3.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-logger@2.0.0...@ima/plugin-logger@3.0.0) (2020-06-08)

### Features

- 🎸 Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.0.0 - 2019-10-23

### Removed

- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+

## 1.0.0 - 2019-10-07

### Added

- init release
