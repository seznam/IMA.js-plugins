# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
