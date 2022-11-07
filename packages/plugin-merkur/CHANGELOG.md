# Change Log

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

## [3.1.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-merkur@3.1.1...@ima/plugin-merkur@3.1.2) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-merkur

## [3.1.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-merkur@3.1.0...@ima/plugin-merkur@3.1.1) (2022-01-10)

**Note:** Version bump only for package @ima/plugin-merkur

# [3.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-merkur@3.0.0...@ima/plugin-merkur@3.1.0) (2021-12-13)

### Features

- 🎸 add npm 8 support ([#57](https://github.com/seznam/IMA.js-plugins/issues/57)) ([e671a3f](https://github.com/seznam/IMA.js-plugins/commit/e671a3fb8d87c39c2da43339782fdca4bf78375d))

# [3.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-merkur@2.2.0...@ima/plugin-merkur@3.0.0) (2021-08-27)

### Bug Fixes

- 🐛 Fixed slot cache deletion ([af25840](https://github.com/seznam/IMA.js-plugins/commit/af25840a21f952a0730ebebe581fb3a759d0cf11))

### BREAKING CHANGES

- 🧨 Renamed slots in data param in get method to slot

# [2.2.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-merkur@2.1.1...@ima/plugin-merkur@2.2.0) (2021-08-26)

### Bug Fixes

- 🐛 Slots html is now removed from ima cache ([ad84fe8](https://github.com/seznam/IMA.js-plugins/commit/ad84fe87dbeb1669ac836ab599874657bddbe3db))
- add calling super constructor ([b972180](https://github.com/seznam/IMA.js-plugins/commit/b972180bd2559a4221e1f183e98059af37610379))
- reverted containerSelector check in request params ([aa185d8](https://github.com/seznam/IMA.js-plugins/commit/aa185d8c04f34425babacff1ed8f72535a52eadd))

### Features

- 🎸 add node16 and npm7 support ([#49](https://github.com/seznam/IMA.js-plugins/issues/49)) ([16fcc0e](https://github.com/seznam/IMA.js-plugins/commit/16fcc0eab73da5651171d110100e5a5ec9cbdcf1))

## [2.1.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-merkur@2.1.0...@ima/plugin-merkur@2.1.1) (2021-08-19)

### Bug Fixes

- removed error check for containerSelector property ([dae1d90](https://github.com/seznam/IMA.js-plugins/commit/dae1d9086cbddee877e9455187bbdc8277edcf83))

# [2.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-merkur@2.0.1...@ima/plugin-merkur@2.1.0) (2021-05-28)

### Features

- support for merkur slots ([dcadae6](https://github.com/seznam/IMA.js-plugins/commit/dcadae625c7952fe5ef31b17608f8c278bc84f1b))

## [2.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-merkur@2.0.0...@ima/plugin-merkur@2.0.1) (2021-05-27)

### Bug Fixes

- 🐛 set containerSelector to response for widget props ([#47](https://github.com/seznam/IMA.js-plugins/issues/47)) ([228048e](https://github.com/seznam/IMA.js-plugins/commit/228048e9b44dd6ef2208b2d541033870edd17041))

# 2.0.0 (2021-05-09)

### Features

- 🎸 add plugin-merkur ([877722b](https://github.com/seznam/IMA.js-plugins/commit/877722b238de2a6ecc59db096c2b5e523c5eaf3c))
