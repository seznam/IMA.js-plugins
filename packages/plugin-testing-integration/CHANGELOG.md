# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
