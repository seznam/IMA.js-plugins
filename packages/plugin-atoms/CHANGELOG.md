<a name="5.0.1"></a>

## 10.1.2

### Patch Changes

- 6d92917: Code refactorings, moved type extensions to separate file to cleanup main.ts

## 10.1.1

### Patch Changes

- e4c3321: Fixed export of VisibilityOptions type.

## 10.1.0

### Minor Changes

- fc4cfa6: Added export for type VisibilityOptions

## 10.0.2

### Patch Changes

- 740924a: Fix loading state for cached images where onLoad is not called

## 10.0.1

### Patch Changes

- 5946f0d: Image `atom-placeholder` CSS class is set only for lazy loading image. CSS class is removed after image was loaded. It is useful for PNG image with alpha and keep similar logic with previous major version.

## 10.0.0

### Major Changes

- b6ff921: The AMP support is removed from package.

  The headlines components have removed `mode` property. The css class of headline has changed from `atm-{Type}` to `atm-headline-{Type}`. All props are passed directly to element except of `children`, `html`, `className` and `type`.

  The Iframe and Image have `layout` property which can be set to `LAYOUT.RESPONSIVE` or `LAYOUT.FILL`. The `layout` property for Image component is then transformed to inline style which can be override. The parent element must be set css property `position` at least to `relative` for layout value set to `LAYOUT.FILL`. The Iframe component keep same behaviour with previous version.

  The Iframe component has removed deprectecated default value for `frameBorder: '0'` and `scrolling: 'no'`. The `no-loading` property is renamed to `loading`. The values can be set to `lazy` or `eager`. We changed that because we removed AMP support and `loading` property is native HTML attribute. The Iframe component use for lazy loading still JS implementation instead of native browser implementation. The benchmark test for native lazy loading `iframe` was worse than actual JS implementation. It can change in the future if browser behaviour change. Iframe component keep no-script behaviour but now use `serializeObjectToNoScript` method for transforming all props to string.

  The Image component is rewritten to use only `img` element which is not wrapped with `div`. The `placeholder` logic for using placeholder as image source was removed and `placeholder` property can be only boolean (default: true). The `no-loading` property is renamed to `loading`. The values can be set to `lazy` or `eager`. We changed that because we removed AMP support and `loading` property is native HTML attribute. The Image component use for lazy loading native browser feature through `loading` property which default value is set to `lazy` and `decoding` property is set to `async`. The Image component don't show `alt` text during lazy loading image or after failing loading image. The `alt` attribute is always set if is defined.

  The Link, List, ListItem and Paragraph components have removed `mode` property.

  The Loader component has removed `mode` and `layout` property. If you need define `small` or other size of Loader use `fontSize` directly in `style` property. For centering Loader in parent element use new `center` prop set to true instead of `layout='center'`.

  All components are memoized. So if you pass function as prop use `useCallback` or something similar to pass same reference. All valid props are passed directly to native element as attributes.

  All components are not registered to `ima.ui.atom.*` namespace. If you need it in your project you can still do it with `ns.namespace` and `ns.set` methods directly in your project.

  Plugin settings was removed because it doesn't need now.

- b6ff921: Removed atomAmp.less file.

  The some useless css classes and rules are removed: `atm-blur`, `atm-visibility`, `atm-cover`, `atm-list-*`, `atm-loader-small` and `atm-cover img`.

## 9.0.1

### Patch Changes

- 110c2af: Removed invalid RC version ranges in package.json files

## 9.0.0

### Major Changes

- 192d82e: IMA@19 compatibility fixes

### Patch Changes

- de5b640: Added plugin settings exports
- 37c3f2f: Udpated dependencies to support RC ima versions
- 75efac8: Fixed types path in package.json
- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps
- d08218b: Added type declarations generated from JSdoc
- 6d47aaa: Side effects notation from package.json
- 5717869: Added $dependencies typing comments for TS apps

## 9.0.0-rc.7

### Patch Changes

- de5b640: Added plugin settings exports

## 9.0.0-rc.6

### Patch Changes

- 5717869: Added $dependencies typing comments for TS apps

## 9.0.0-rc.5

### Patch Changes

- 75efac8: Fixed types path in package.json

## 9.0.0-rc.4

### Patch Changes

- 6d47aaa: Side effects notation from package.json

## 9.0.0-rc.3

### Patch Changes

- d08218b: Added type declarations generated from JSdoc

## 9.0.0-rc.2

### Patch Changes

- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps

## 9.0.0-rc.1

### Patch Changes

- 37c3f2f: Udpated dependencies to support RC ima versions

## 9.0.0-rc.0

### Major Changes

- 192d82e: IMA@19 compatibility fixes

### Patch Changes

- Updated dependencies [192d82e]
  - @ima/plugin-useragent@5.0.0-rc.0

## 8.1.0

### Minor Changes

- c8e0a08: Trim Link url during sanitize

## 8.0.1

### Patch Changes

- dd4dd52: Updated to latest @ima/plugin-cli - the final bundle now contains new styles folder containing all less/css files and they are no longer bundled into esm bundle

## 8.0.0

### Major Changes

- f759cca: Added support for IMA18

## 7.0.1

### Patch Changes

- 736accd: Unfreezted @ima/plugin-useragent freezed peer dependency

## 7.0.0

### Major Changes

- fb5bfe9: rename text prop to html, SanitizeUrl
- b61f5f4: Relocated to IMA.js plugins monorepo
- 5149e99: Added additional CJS builds to npm dist directory

### Patch Changes

- 431ad38: Fixed node config packages
- 1c61a6d: Automatic JSX runtime, deps update
- f7fe41d: Updated to latest version of plugin-cli
- 15e981a: Updated plugin-cli to latest version
- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge
- 9bf6acf: @ima/plugin-cli version bump
- 1a6651d: Migrated to react-page-renderer
- Updated dependencies [431ad38]
- Updated dependencies [fb1a51e]
- Updated dependencies [1c61a6d]
- Updated dependencies [d0f1969]
- Updated dependencies [5149e99]
- Updated dependencies [f7fe41d]
- Updated dependencies [15e981a]
- Updated dependencies [df68488]
- Updated dependencies [1256647]
- Updated dependencies [113952b]
- Updated dependencies [9bf6acf]
- Updated dependencies [1a6651d]
- Updated dependencies [0b81d28]
  - @ima/plugin-useragent@4.0.0

## 7.0.0-rc.12

### Patch Changes

- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge
- Updated dependencies [df68488]
- Updated dependencies [113952b]
  - @ima/plugin-useragent@4.0.0-rc.11

## 7.0.0-rc.11

### Major Changes

- fb5bfe9: rename text prop to html, SanitizeUrl

## 7.0.0-rc.10

### Patch Changes

- 1c61a6d: Automatic JSX runtime, deps update
- Updated dependencies [1c61a6d]
  - @ima/plugin-useragent@4.0.0-rc.10

## 7.0.0-rc.9

### Patch Changes

- 9bf6acf: @ima/plugin-cli version bump
- Updated dependencies [9bf6acf]
  - @ima/plugin-useragent@4.0.0-rc.9

## 7.0.0-rc.8

### Patch Changes

- 15e981a: Updated plugin-cli to latest version
- Updated dependencies [15e981a]
  - @ima/plugin-useragent@4.0.0-rc.8

## 7.0.0-rc.7

### Patch Changes

- 1a6651d: Migrated to react-page-renderer
- Updated dependencies [1a6651d]
  - @ima/plugin-useragent@4.0.0-rc.7

## 7.0.0-rc.6

### Patch Changes

- 431ad38: Fixed node config packages
- Updated dependencies [431ad38]
  - @ima/plugin-useragent@4.0.0-rc.6

## 7.0.0-rc.5

### Patch Changes

- f7fe41d: Updated to latest version of plugin-cli
- Updated dependencies [f7fe41d]
  - @ima/plugin-useragent@4.0.0-rc.5

## 7.0.0-rc.4

### Major Changes

- 5149e99: Added additional CJS builds to npm dist directory

### Patch Changes

- Updated dependencies [5149e99]
  - @ima/plugin-useragent@4.0.0-rc.4

## 7.0.0-rc.3

### Major Changes

- b61f5f4: Relocated to IMA.js plugins monorepo

## 7.0.0-rc.2

### Major Changes

- 81474ba: New build approach using @ima/plugin-cli
  The package is now pure esm module

### Patch Changes

- aa10023: Fixed server-specific pragma syntax

## 7.0.0-rc.1

### Patch Changes

- 803a3e2: fix build for release process

## 7.0.0-rc.0

### Major Changes

- cf120b1: Migrate to ima 18

## [5.0.1](https://github.com/seznam/IMA.js-ui-atoms/compare/v5.0.0...v5.0.1) (2022-02-15)

### Bug Fixes

- calling notify after register ([#68](https://github.com/seznam/IMA.js-ui-atoms/issues/68)) ([56df17c](https://github.com/seznam/IMA.js-ui-atoms/commit/56df17c))

<a name="3.4.0"></a>

# [3.4.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.3.0...v3.4.0) (2021-04-29)

<a name="3.3.0"></a>

# [3.3.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.2.0...v3.3.0) (2021-02-05)

### Features

- **htmlimage:** added experimental placeholder properties ([2920c6a](https://github.com/seznam/IMA.js-ui-atoms/commit/2920c6a))

### Reverts

- process commits ([629dc86](https://github.com/seznam/IMA.js-ui-atoms/commit/629dc86))

<a name="3.4.0"></a>

# [3.4.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.3.0...v3.4.0) (2021-04-29)

<a name="3.3.0"></a>

# [3.3.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.2.0...v3.3.0) (2021-02-05)

### Features

- **htmlimage:** added experimental placeholder properties ([2920c6a](https://github.com/seznam/IMA.js-ui-atoms/commit/2920c6a))

### Reverts

- process commits ([629dc86](https://github.com/seznam/IMA.js-ui-atoms/commit/629dc86))

<a name="3.2.0"></a>

# [3.2.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.1.1...v3.2.0) (2020-11-19)

<a name="3.2.0"></a>

# [3.2.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.1.1...v3.2.0) (2020-11-19)

<a name="3.1.1"></a>

## [3.1.1](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.1.0...v3.1.1) (2020-11-18)

### Features

- **link/link.jsx:** added `rel` support for <link /> component ([#62](https://github.com/seznam/IMA.js-ui-atoms/issues/62)) ([8654447](https://github.com/seznam/IMA.js-ui-atoms/commit/8654447))

<a name="3.1.0"></a>

# [3.1.0](https://github.com/seznam/IMA.js-ui-atoms/compare/3.0.2...v3.1.0) (2020-08-26)

### Features

- **link.jsx:** added support of onAuxClick and onContextMenu to Link ([#61](https://github.com/seznam/IMA.js-ui-atoms/issues/61)) ([54b430c](https://github.com/seznam/IMA.js-ui-atoms/commit/54b430c))

<a name="3.0.2"></a>

## [3.0.2](https://github.com/seznam/IMA.js-ui-atoms/compare/3.0.1...3.0.2) (2020-06-02)

<a name="3.4.0"></a>

# [3.4.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.2.0...v3.4.0) (2021-02-05)

### Features

- **htmlimage:** added experimental placeholder properties ([2920c6a](https://github.com/seznam/IMA.js-ui-atoms/commit/2920c6a))

<a name="3.4.0"></a>

# [3.4.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.2.0...v3.4.0) (2021-02-05)

### Features

- **htmlimage:** added experimental placeholder properties ([2920c6a](https://github.com/seznam/IMA.js-ui-atoms/commit/2920c6a))

<a name="3.2.0"></a>

# [3.2.0](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.1.1...v3.2.0) (2020-11-19)

<a name="3.1.1"></a>

## [3.1.1](https://github.com/seznam/IMA.js-ui-atoms/compare/v3.1.0...v3.1.1) (2020-11-18)

### Features

- **link/link.jsx:** added `rel` support for <link /> component ([#62](https://github.com/seznam/IMA.js-ui-atoms/issues/62)) ([8654447](https://github.com/seznam/IMA.js-ui-atoms/commit/8654447))

<a name="3.1.0"></a>

# [3.1.0](https://github.com/seznam/IMA.js-ui-atoms/compare/3.0.2...v3.1.0) (2020-08-26)

### Features

- **link.jsx:** added support of onAuxClick and onContextMenu to Link ([#61](https://github.com/seznam/IMA.js-ui-atoms/issues/61)) ([54b430c](https://github.com/seznam/IMA.js-ui-atoms/commit/54b430c))

<a name="3.0.2"></a>

## [3.0.2](https://github.com/seznam/IMA.js-ui-atoms/compare/3.0.1...3.0.2) (2020-06-02)

<a name="3.0.2"></a>

## [3.0.2](https://github.com/seznam/IMA.js-ui-atoms/compare/3.0.1...3.0.2) (2020-06-02)

<a name="3.0.1"></a>

## [3.0.1](https://github.com/seznam/IMA.js-ui-atoms/compare/3.0.0...3.0.1) (2020-05-13)

### Bug Fixes

- **npm:** fix installation warning for npm 6 ([21097d0](https://github.com/seznam/IMA.js-ui-atoms/commit/21097d0))

<a name="3.0.0"></a>

# [3.0.0](https://github.com/seznam/IMA.js-ui-atoms/compare/2.0.2...3.0.0) (2020-05-07)

### Bug Fixes

- **componentpositions:** getBoundingClientRect() iOS fix ([211f46f](https://github.com/seznam/IMA.js-ui-atoms/commit/211f46f)), closes [#59](https://github.com/seznam/IMA.js-ui-atoms/issues/59)

<a name="2.0.2"></a>

## [2.0.2](https://github.com/seznam/IMA.js-ui-atoms/compare/2.0.1...2.0.2) (2019-12-07)

<a name="2.0.1"></a>

## [2.0.1](https://github.com/seznam/IMA.js-ui-atoms/compare/2.0.0...2.0.1) (2019-12-07)

<a name="2.0.0"></a>

# [2.0.0](https://github.com/seznam/IMA.js-ui-atoms/compare/1.3.0...2.0.0) (2019-12-07)

### Features

- update to IMA@17 ([5c45ad6](https://github.com/seznam/IMA.js-ui-atoms/commit/5c45ad6)), ([806428c](https://github.com/seznam/IMA.js-ui-atoms/commit/806428c))

<a name="1.3.0"></a>

# [1.3.0](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.10...1.3.0) (2019-11-13)

### Features

- **noscript:** added option for disabling noScript rendering ([34fe2df](https://github.com/seznam/IMA.js-ui-atoms/commit/34fe2df))

<a name="1.2.10"></a>

## [1.2.10](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.9...1.2.10) (2019-04-24)

### Bug Fixes

- **componentpositions:** fixed returning size for invisible element ([3d00a9c](https://github.com/seznam/IMA.js-ui-atoms/commit/3d00a9c))

<a name="1.2.9"></a>

## [1.2.9](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.8...1.2.9) (2019-01-14)

<a name="1.2.8"></a>

## [1.2.8](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.7...1.2.8) (2018-11-21)

### Features

- **iframe:** added marginWidth, marginHeight properties ([056a05f](https://github.com/seznam/IMA.js-ui-atoms/commit/056a05f))

<a name="1.2.7"></a>

## [1.2.7](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.6...1.2.7) (2018-10-12)

### Bug Fixes

- **uicomponenthelper:** unregister observer even after the first position calculation ([edb88f9](https://github.com/seznam/IMA.js-ui-atoms/commit/edb88f9))

### Features

- **htmlimage,htmliframe,htmlvideo:** usage of the intersection observer is adjustable in Settings ([fc12718](https://github.com/seznam/IMA.js-ui-atoms/commit/fc12718))

<a name="1.2.6"></a>

## [1.2.6](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.5...1.2.6) (2018-09-07)

### Bug Fixes

- **iframe:** allow updating noloading props after mounting ([1003262](https://github.com/seznam/IMA.js-ui-atoms/commit/1003262))

<a name="1.2.5"></a>

## [1.2.5](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.4...1.2.5) (2018-08-31)

### Bug Fixes

- **htmlimage:** reduced amount of imageObserver padding ([9ca44a5](https://github.com/seznam/IMA.js-ui-atoms/commit/9ca44a5))

<a name="1.2.4"></a>

## [1.2.4](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.3...1.2.4) (2018-08-21)

### Bug Fixes

- **uicomponenthelper:** ratio of 0 fixed ([1dfa870](https://github.com/seznam/IMA.js-ui-atoms/commit/1dfa870)), closes [#50](https://github.com/seznam/IMA.js-ui-atoms/issues/50)

<a name="1.2.3"></a>

## [1.2.3](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.2...1.2.3) (2018-08-07)

### Bug Fixes

- allow attribure "role" for component aria props ([1b75ba3](https://github.com/seznam/IMA.js-ui-atoms/commit/1b75ba3))

<a name="1.2.2"></a>

## [1.2.2](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.1...1.2.2) (2018-08-02)

### Bug Fixes

- visibility helper - unregister only registered listeners ([01d911c](https://github.com/seznam/IMA.js-ui-atoms/commit/01d911c))

<a name="1.2.1"></a>

## [1.2.1](https://github.com/seznam/IMA.js-ui-atoms/compare/1.2.0...1.2.1) (2018-07-05)

<a name="1.2.0"></a>

# [1.2.0](https://github.com/seznam/IMA.js-ui-atoms/compare/1.1.3...1.2.0) (2018-06-28)

### Bug Fixes

- **htmliframe:** fixed PropTypes ([6447e8f](https://github.com/seznam/IMA.js-ui-atoms/commit/6447e8f)), closes [#46](https://github.com/seznam/IMA.js-ui-atoms/issues/46)
- **loader:** name of the animation keyframes scrambles correctly ([1fe7c2b](https://github.com/seznam/IMA.js-ui-atoms/commit/1fe7c2b))

### Features

- **htmliframe:** added onload property ([2633253](https://github.com/seznam/IMA.js-ui-atoms/commit/2633253)), closes [#46](https://github.com/seznam/IMA.js-ui-atoms/issues/46)
- **htmlimage:** added onload and onerror properties ([f7f6b45](https://github.com/seznam/IMA.js-ui-atoms/commit/f7f6b45))
- **visibility:** added notify method and unify event structure ([7b4047a](https://github.com/seznam/IMA.js-ui-atoms/commit/7b4047a))

<a name="1.1.3"></a>

## [1.1.3](https://github.com/seznam/IMA.js-ui-atoms/compare/1.1.2...1.1.3) (2018-06-25)

### Bug Fixes

- **htmlimage:** use src if srcset not supported ([9d47983](https://github.com/seznam/IMA.js-ui-atoms/commit/9d47983)), closes [#43](https://github.com/seznam/IMA.js-ui-atoms/issues/43)

<a name="1.1.2"></a>

## [1.1.2](https://github.com/seznam/IMA.js-ui-atoms/compare/1.1.1...1.1.2) (2018-06-20)

### Bug Fixes

- **htmlimage:** returning value from getDerivedStateFromProps ([113daa3](https://github.com/seznam/IMA.js-ui-atoms/commit/113daa3))

<a name="1.1.1"></a>

## [1.1.1](https://github.com/seznam/IMA.js-ui-atoms/compare/1.1.0...1.1.1) (2018-06-19)

### Bug Fixes

- **less:** added missing less files in published module ([4ce31e3](https://github.com/seznam/IMA.js-ui-atoms/commit/4ce31e3))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/seznam/IMA.js-ui-atoms/compare/1.0.0...1.1.0) (2018-06-19)

### Bug Fixes

- **noscript:** serialize arai-\* attributes for noscript tag ([7329966](https://github.com/seznam/IMA.js-ui-atoms/commit/7329966))

### Features

- **iframe:** added new prop allow ([11c9a74](https://github.com/seznam/IMA.js-ui-atoms/commit/11c9a74))
- **loader:** default color for the loader ([c358ff0](https://github.com/seznam/IMA.js-ui-atoms/commit/c358ff0))
- **loader:** option to render loader in white version ([7cc7b35](https://github.com/seznam/IMA.js-ui-atoms/commit/7cc7b35))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/seznam/IMA.js-ui-atoms/compare/0.11.11...1.0.0) (2018-06-12)

### BREAKING CHANGES

- **UIComponentHelper:** removed deprecated methods convertToNumber, getWindowViewportRect, getBoundingClientRect, getPercentOfVisibility and throttle. Use instead of that UIComponentHelper.componentPositions.(convertToNumber|getWindowViewportRect|getBoundingClientRect|getPercentOfVisibility) and UIComponentHelper.visibility.throttle.

- **Visibility:** Visibility writer function receive full circle entry object with payload as argument. The payload are set from visibility reader. For parsing payload you can use [UIComponentHelper.wrapVisibilityWriter](https://github.com/seznam/IMA.js-ui-atoms/blob/master/src/UIComponentHelper.js#L254).

- **Less:** Less files are in dist folder. You must update your app/build.js file from `./node_modules/ima-ui-atoms/*.less` to `./node_modules/ima-ui-atoms/dist/*.less`.
