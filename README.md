# IMA.js plugins


[![Known Vulnerabilities](https://snyk.io/test/github/seznam/IMA.js-plugins/badge.svg)](https://snyk.io/test/github/seznam/IMA.js-plugins)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)


## Changesets

We are using [changesets](https://github.com/changesets/changesets/blob/main/docs/common-questions.md) for version management.

To simplify the changeset creation process, you can use command

```bash
npm run changeset
```

It opens an interactive interface, which should help you with changeset file composition.

## Release
For a new version release of packages, we use changesets, which will automatically bump version and generate changelogs. Following command will initialize interactive guide through the version release per package. Run from root:

```bash
npm run release
```

This command prepares commit, tag and pushes everything to git and triggers pipeline in CI, which publishes the packages into npm registry.

### Versioning
Plugins in this repository are abided by [Semantic Versioning](https://semver.org/).
Among others this means that plugins with major version zero (0.y.z) shouldn't be used in production.
Such plugins are in development or are not tested enough to be marked as **"production ready"**.
That doesn't necessary mean that this plugin version is not stable (or is not currently running in production environment on some project), but it's a way to say **"Don't use it yet"** to other teams.

### Release candidate
We use changesets [prereleases](https://github.com/changesets/changesets/blob/main/docs/prereleases.md) in this repository to release RC versions of packages.

Pre-release maintener usualy inits this stage **once** by `npm run release:next:init` and team then commit and release RC version from branch `next` by common release command `npm run release`.

Maintener can close pre-release stage by `npm run release:graduate` command , whitch will exit `pre` mode and releases new production versions of packages.


## Packages:
The IMA.js plugins is multi-package repository containing most commonly used plugins on IMA.js application development stack.

- [**cli-plugin-analyze**](packages/cli-plugin-analyze)
- [**cli-plugin-legacy-css**](packages/cli-plugin-legacy-css)
- [**cli-plugin-less-constants**](packages/cli-plugin-less-constants)
- [**cli-plugin-scramble-css**](packages/cli-plugin-scramble-css)
- [**plugin-analytic**](packages/plugin-analytic)
- [**plugin-analytic-fb-pixel**](packages/plugin-analytic-fb-pixel)
- [**plugin-analytic-google**](packages/plugin-analytic-google)
- [**plugin-atoms**](packages/plugin-atoms)
- [**plugin-halson-rest-client**](packages/plugin-halson-rest-client)
- [**plugin-http-client**](packages/plugin-http-client)
- [**plugin-local-storage**](packages/plugin-local-storage)
- [**plugin-logger**](packages/plugin-logger)
- [**plugin-managed-component**](packages/plugin-managed-component)
- [**plugin-merkur**](packages/plugin-merkur)
- [**plugin-resource-loader**](packages/plugin-resource-loader)
- [**plugin-rest-client**](packages/plugin-rest-client)
- [**plugin-script-loader**](packages/plugin-script-loader)
- [**plugin-select**](packages/plugin-select)
- [**plugin-self-xss**](packages/plugin-self-xss)
- [**plugin-shared-cache**](packages/plugin-shared-cache)
- [**plugin-style-loader**](packages/plugin-style-loader)
- [**plugin-testing-integration**](packages/plugin-testing-integration)
- [**plugin-useragent**](packages/plugin-useragent)
- [**plugin-websocket**](packages/plugin-websocket)

follow the prompt and fill proper data to setup plugin properties.

## IMA.js
The IMA.js is an application development stack for developing isomorphic applications written in pure JavaScript. You can find the IMA.js skeleton application at https://github.com/seznam/ima.

## Contributing
Contribute to this project via [Pull-Requests](https://github.com/seznam/IMA.js-plugins/pulls).

### Set up the dev environment

Our dev stack expects `node>=18` and `npm>=8`.

To set up, simply run `npm ci` from the repo root.
