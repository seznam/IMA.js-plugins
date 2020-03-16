# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
