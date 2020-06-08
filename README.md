# IMA.js plugins

[![Build Status](https://travis-ci.org/seznam/IMA.js-plugins.svg?branch=master)](https://travis-ci.org/seznam/IMA.js-plugins)
[![Known Vulnerabilities](https://snyk.io/test/github/seznam/IMA.js-plugins/badge.svg)](https://snyk.io/test/github/seznam/IMA.js-plugins)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

For release new version of packages use lerna. Use following script:

`npm run release`

The IMA.js plugins is multi-package repository containing most commonly used plugins on IMA.js application development stack.

- [**plugin-analytic**](packages/plugin-analytic)
- [**plugin-analytic-fb-pixel**](packages/plugin-analytic-fb-pixel)
- [**plugin-analytic-google**](packages/plugin-analytic-google)
- [**plugin-less-constants**](packages/plugin-less-constants)
- [**plugin-logger**](packages/plugin-logger)
- [**plugin-resource-loader**](packages/plugin-resource-loader)
- [**plugin-rest-client**](packages/plugin-rest-client)
- [**plugin-script-loader**](packages/plugin-script-loader)
- [**plugin-shared-cache**](packages/plugin-shared-cache)
- [**plugin-select**](packages/plugin-select)
- [**plugin-self-xss**](packages/plugin-self-xss)
- [**plugin-style-loader**](packages/plugin-style-loader)
- [**plugin-useragent**](packages/plugin-useragent)
- [**plugin-xhr**](packages/plugin-xhr)
- [**plugin-local-storage**](packages/plugin-local-storage)
- [**plugin-testing-integration**](packages/plugin-testing-integration)
- [**plugin-websocket**](packages/plugin-websocket)
- [**plugin-hot-reload**](packages/plugin-hot-reload)

## Create new plugin from hygen template

```bash
npx hygen plugin create
```

follow the prompt and fill proper data to setup plugin properties.

## IMA.js
The IMA.js is an application development stack for developing isomorphic applications written in pure JavaScript. You can find the IMA.js skeleton application at https://github.com/seznam/ima.
