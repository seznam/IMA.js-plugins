# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
