# Change Log

## 6.0.2

### Patch Changes

- 5be91a5: Updated to latest @ima/core

## 6.0.1

### Patch Changes

- 2492fab: Smaller style changes in files because of update of prettier/eslint build dependency.

## 6.0.0

### Major Changes

- 8908212: Removed config from constructor of `AbstractAnalytic`

  - **What?**
    - Removed `defaultDependencies` from plugin.
    - Removed config from constructor of `AbstractAnalytic`
    - Properties `_loaded`, `_scriptLoader`, `_dispatcher` and method `_afterLoadCallback` are now protected.
      (`#loaded`, `#scriptLoader`, `#dispatcher`, `#afterLoadCallback`)
      - New method `_isLoaded`.
  - **Why?**
    - `defaultDependencies` was weird pattern, and we want to get rid of it
    - To be able to use spread operator for dependencies in constructor of classes which extends `AbstractAnalytic`.
      Until now, we had to repeat all arguments from `AbstractAnalytic` constructor if we wanted to access `config` parameter, which is very common use-case.
      Also, now we can work with types in TypeScript more easily.
    - To clear the interface of `AbstractAnalytic`.
  - **How?**

    - Replace use of `defaultDependencies` by `AbstractAnalytic.$dependencies`
    - Classes, which extends `AbstractAnalytic` needs to save given config argument on their own.
      But you can use rest operator now.

          Therefore, this:
          ```javascript
          class MyClass extends AbstractAnalytic {
              // Even here we were forced to copy dependencies from AbstractAnalytic to specify settings (last value in the array)
              static get $dependencies() {
                  return [
                      NonAbstractAnalyticParam,
                      ScriptLoaderPlugin,
                      '$Window',
                      '$Dispatcher',
                      '$Settings.plugin.analytic.myClass',
                  ];
              }

              constructor(nonAbstractAnalyticParam, scriptLoader, window, dispatcher, config) {
                  super(scriptLoader, window, dispatcher, config);

                  this._nonAbstractAnalyticParam = nonAbstractAnalyticParam;

                  this._id = config.id; // due to this line we were forced to copy all arguments of AbstractAnalytic

                  // ...
              }
          }
          ```
          ...can be rewritten to this:
          ```javascript
          class MyClass extends AbstractAnalytic {
              // now we can define only added dependencies and use spread for the rest
              static get $dependencies() {
                  return [
                      NonAbstractAnalyticParam,
                      '$Settings.plugin.analytic.myClass',
                      ...AbstractAnalytic.$dependencies
                  ];
              }

              constructor(nonAbstractAnalyticParam, config, ...rest) {
                  super(...rest);

                  this._nonAbstractAnalyticParam = nonAbstractAnalyticParam;

                  this._config = config;

                  this._id = config.id;

                  // ...
              }
          }
          ```

      - Replace use of `_scriptLoader`, `_dispatcher` and `_afterLoadCallback` to `#scriptLoader`, `#dispatcher` and `#afterLoadCallback`.
        Check if script is loaded by calling new method `_isLoaded()`.

## 5.0.7

### Patch Changes

- 8f5d01a: Fixed build issues with client server config

## 5.0.6

### Patch Changes

- e2eeb2b: Turbo, eslint update, types exports, new tsconfig

## 5.0.5

### Patch Changes

- 6d92917: Code refactorings, moved type extensions to separate file to cleanup main.ts
- Updated dependencies [535f56e]
- Updated dependencies [6d92917]
  - @ima/plugin-script-loader@4.0.0

## 5.0.4

### Patch Changes

- 038a8ea: Typescriptization (from .js to .ts)

## 5.0.3

### Patch Changes

- 110c2af: Removed invalid RC version ranges in package.json files

## 5.0.2

### Patch Changes

- de5b640: Added plugin settings exports
- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps
- d08218b: Added type declarations generated from JSdoc
- e75b1da: Added dispatcher types
- 6d47aaa: Side effects notation from package.json
- 5717869: Added $dependencies typing comments for TS apps

## 5.0.2-rc.5

### Patch Changes

- de5b640: Added plugin settings exports

## 5.0.2-rc.4

### Patch Changes

- 5717869: Added $dependencies typing comments for TS apps

## 5.0.2-rc.3

### Patch Changes

- e75b1da: Added dispatcher types

## 5.0.2-rc.2

### Patch Changes

- 6d47aaa: Side effects notation from package.json

## 5.0.2-rc.1

### Patch Changes

- d08218b: Added type declarations generated from JSdoc

## 5.0.2-rc.0

### Patch Changes

- 2e61a48: Built using new version of @ima/plugin-cli, js sources now include source maps
- Updated dependencies [2e61a48]
  - @ima/plugin-script-loader@3.1.1-rc.0

## 5.0.1

### Patch Changes

- dd4dd52: Updated to latest @ima/plugin-cli - the final bundle now contains new styles folder containing all less/css files and they are no longer bundled into esm bundle

## 5.0.0

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
- Updated dependencies [431ad38]
- Updated dependencies [fb1a51e]
- Updated dependencies [1c61a6d]
- Updated dependencies [5149e99]
- Updated dependencies [f7fe41d]
- Updated dependencies [15e981a]
- Updated dependencies [df68488]
- Updated dependencies [1256647]
- Updated dependencies [113952b]
- Updated dependencies [9bf6acf]
- Updated dependencies [1a6651d]
- Updated dependencies [0b81d28]
  - @ima/plugin-script-loader@3.0.0

## 5.0.0-rc.10

### Patch Changes

- df68488: All plugin maintenance relase
- 113952b: Preventive update after master merge

## 5.0.0-rc.9

### Patch Changes

- 1c61a6d: Automatic JSX runtime, deps update

## 5.0.0-rc.8

### Patch Changes

- 9bf6acf: @ima/plugin-cli version bump

## 5.0.0-rc.7

### Patch Changes

- 15e981a: Updated plugin-cli to latest version

## 5.0.0-rc.6

### Patch Changes

- 1a6651d: Migrated to react-page-renderer

## 5.0.0-rc.5

### Patch Changes

- 431ad38: Fixed node config packages

## 5.0.0-rc.4

### Patch Changes

- f7fe41d: Updated to latest version of plugin-cli

## 5.0.0-rc.3

### Major Changes

- 5149e99: Added additional CJS builds to npm dist directory

### Patch Changes

- Updated dependencies [5149e99]
  - @ima/plugin-script-loader@3.0.0-rc.3

## 5.0.0-rc.2

### Major Changes

- fb1a51e: Migrated packages to pure esm modules

### Patch Changes

- Updated dependencies [fb1a51e]
  - @ima/plugin-script-loader@3.0.0-rc.2

## 5.0.0-rc.1

### Minor Changes

- 0b81d28: npmignore revert logic, add missing npmignore
  apply pluginLoader
  update ima peer deps
  refactor plugin register functions, remove exports for ima17

### Patch Changes

- Updated dependencies [0b81d28]
  - @ima/plugin-script-loader@3.0.0-rc.1

## 5.0.0-rc.0

### Major Changes

- 1256647: Add support for IMA 18, Node 18 and npm 8

### Patch Changes

- Updated dependencies [1256647]
  - @ima/plugin-script-loader@3.0.0-rc.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic@4.1.1...@ima/plugin-analytic@4.1.2) (2022-01-11)

**Note:** Version bump only for package @ima/plugin-analytic

## [4.1.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic@4.1.0...@ima/plugin-analytic@4.1.1) (2022-01-10)

**Note:** Version bump only for package @ima/plugin-analytic

# [4.1.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic@4.0.2...@ima/plugin-analytic@4.1.0) (2021-12-13)

### Features

- 🎸 you can pass purposeConsents into init method (GDPR) ([#59](https://github.com/seznam/IMA.js-plugins/issues/59)) ([d5e5193](https://github.com/seznam/IMA.js-plugins/commit/d5e5193405186a4856e398e53677ff62cb81cd3a))

## [4.0.2](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic@4.0.1...@ima/plugin-analytic@4.0.2) (2021-08-26)

**Note:** Version bump only for package @ima/plugin-analytic

## [4.0.1](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic@4.0.0...@ima/plugin-analytic@4.0.1) (2020-06-22)

**Note:** Version bump only for package @ima/plugin-analytic

# [4.0.0](https://github.com/seznam/IMA.js-plugins/compare/@ima/plugin-analytic@3.0.0...@ima/plugin-analytic@4.0.0) (2020-06-08)

### Features

- 🎸 Unified build and release process via rollup and lerna ([df277ce](https://github.com/seznam/IMA.js-plugins/commit/df277ce5bae0cacc9c5b4d6957bdc786ac9cf571))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.0.0 - 2019-11-28

### Removed

- **BREAKING CHANGE!** IMA.js v16 and lower is no longer supported, you need to upgrade to IMA.js v17+
