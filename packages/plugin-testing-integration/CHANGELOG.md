# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.2.4 - 2020-04-15
### Fixed
- Fixed url propagation into jsdom when using `router.route()` to navigate to  aspecific application route

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
