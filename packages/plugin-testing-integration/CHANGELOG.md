# Change Log

## 3.0.0-rc.12

### Patch Changes

- 3423e0a: Added forwarding of $App settings from config

## 3.0.0-rc.11

### Patch Changes

- 1c61a6d: Automatic JSX runtime, deps update

## 3.0.0-rc.10

### Patch Changes

- 9bf6acf: @ima/plugin-cli version bump

## 3.0.0-rc.9

### Patch Changes

- 15e981a: Updated plugin-cli to latest version

## 3.0.0-rc.8

### Patch Changes

- 1a6651d: Migrated to react-page-renderer

## 3.0.0-rc.7

### Patch Changes

- 431ad38: Fixed node config packages

## 3.0.0-rc.6

### Patch Changes

- f7fe41d: Updated to latest version of plugin-cli

## 3.0.0-rc.5

### Patch Changes

- 051da94: feat: update localization messageformat to v3

## 3.0.0-rc.4

### Major Changes

- 5149e99: Added additional CJS builds to npm dist directory

## 3.0.0-rc.3

### Patch Changes

- a38c8d9: Initialize JSDom before we start importing project files, since some packages can do some client/server detection at this point

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

## [2.2.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.2.1...@ima/plugin-testing-integration@2.2.2) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-testing-integration

## [2.2.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.2.0...@ima/plugin-testing-integration@2.2.1) (2022-01-10)

### Bug Fixes

- 🐛 dont crash if setImmediate is not defined globally ([356f5d6](https://github.com/seznam/IMA.js-plugins/commit/356f5d6a71a64dacff92bab0502d417080f1ae69))

# [2.2.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.1.0...@ima/plugin-testing-integration@2.2.0) (2021-12-13)

### Features

- 🎸 add npm 8 support ([#57](https://github.com/seznam/IMA.js-plugins/issues/57)) ([e671a3f](https://github.com/seznam/IMA.js-plugins/commit/e671a3fb8d87c39c2da43339782fdca4bf78375d))

# [2.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.0.6...@ima/plugin-testing-integration@2.1.0) (2021-08-26)

### Features

- 🎸 add node16 and npm7 support ([#49](https://github.com/seznam/IMA.js-plugins/issues/49)) ([16fcc0e](https://github.com/seznam/IMA.js-plugins/commit/16fcc0eab73da5651171d110100e5a5ec9cbdcf1))

## [2.0.6](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.0.5...@ima/plugin-testing-integration@2.0.6) (2021-08-20)

### Bug Fixes

- 🐛 clearImaApp now clears aop hooks properly ([#51](https://github.com/seznam/IMA.js-plugins/issues/51)) ([f238622](https://github.com/seznam/IMA.js-plugins/commit/f238622f6deb721c434bc97c4da31b6136ebd9e5))

## [2.0.5](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.0.4...@ima/plugin-testing-integration@2.0.5) (2021-03-22)

### Bug Fixes

- 🐛 Enable testing localized code ([#44](https://github.com/seznam/IMA.js-plugins/issues/44)) ([e0afbc8](https://github.com/seznam/IMA.js-plugins/commit/e0afbc8c74c29626a4ee89ac063881b021cfe8f9))

## [2.0.4](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.0.3...@ima/plugin-testing-integration@2.0.4) (2020-10-05)

### Bug Fixes

- 🐛 if render/hydrate in same container drop old wrapper ([#41](https://github.com/seznam/IMA.js-plugins/issues/41)) ([c7e3f9a](https://github.com/seznam/IMA.js-plugins/commit/c7e3f9a450834ddc2c87dde14dfc2f9f33fec1f8))

## [2.0.3](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.0.2...@ima/plugin-testing-integration@2.0.3) (2020-07-27)

### Bug Fixes

- 🐛 router.route is now overridable via application ([#39](https://github.com/seznam/IMA.js-plugins/issues/39)) ([8f73cc0](https://github.com/seznam/IMA.js-plugins/commit/8f73cc0629b65c8a5627e01278debf15224313bd))

## [2.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.0.1...@ima/plugin-testing-integration@2.0.2) (2020-06-30)

### Bug Fixes

- 🐛 Disable treeshake since it is removing key code part ([3f73685](https://github.com/seznam/IMA.js-plugins/commit/3f736859a46882fd741d4c66abfe73a2b7ecb76e))

## [2.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@2.0.0...@ima/plugin-testing-integration@2.0.1) (2020-06-22)

**Note:** Version bump only for package @ima/plugin-testing-integration

# [2.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-testing-integration@1.2.5...@ima/plugin-testing-integration@2.0.0) (2020-06-08)

### Features

- 🎸 Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.2.5 - 2020-05-13

### Fixed

- Fixed warning when using npm 6+

## 1.2.4 - 2020-04-15

### Fixed

- Fixed url propagation into jsdom when using `router.route()` to navigate to aspecific application route

## 1.2.3 - 2020-04-07

### Fixed

- Fixed integration tests for projects using multiple initImaApp calls in single test file

## 1.2.2 - 2020-04-06

### Fixed

- Fixed problem where jsdom was not yet initialized, but required by app/main.js, or app/build.js

## 1.2.1 - 2020-04-06

### Fixed

- Fixed problem where jsdom was not yet initialized, but required by project files, or dependencies

## 1.2.0 - 2020-03-30

### Added

- Config option `TestPageRenderer` to specify IMA Page Renderer used for the test run
- Config option `initSettings` to extend the boot config method for all tests
- Config option `initBindApp` to extend the boot config method for all tests
- Config option `initServicesApp` to extend the boot config method for all tests
- Config option `initRoutes` to extend the boot config method for all tests
- Config option `extendAppObject` to extend return value of `initImaApp` with custom values
- Implemented `EnzymePageRenderer` (to be used with `TestPageRenderer` config option), which can override default IMA Page Renderer and use Enzyme methods to render the page into the jsdom. This allows you to use Enzyme mount wrapper methods to test functionality. The wrapper is exposed via `app.wrapper()`.

## 1.1.1 - 2020-03-16

### Fixed

- Update dependencies

## 1.1.0 - 2020-03-10

### Fixed

- Navigation using click event in jsdom will properly be handled by IMA router
- All window properties are propageted to global scope (resolves problem with missing classes, or methods like btoa, File, ...)
- Implemented deduplication when initializing vendor linker (as is in native IMA.js application)

### Added

- Exposed `getConfig` function, which returns current configuration object. This can be used to extend `prebootScript`, instaed of just overriding it.

## 1.0.3 - 2020-02-28

### Fixed

- Resolved bug with broken native clear timer methods

## 1.0.2 - 2020-01-14

### Fixed

- `clearImaApp` will now clear all timer functions, this should resolve a problem with tests not ending properly, when there are some timeouts, or intervals set by your app.

## 1.0.1 - 2019-12-10

### Fixed

- Updated dependencies to IMA.js v17

## 1.0.0 - 2019-11-28

### Removed

- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+

## 0.1.0 - 2019-11-28

### Added

- Initialized @ima/plugin-testing-integration, see README.md for more info
