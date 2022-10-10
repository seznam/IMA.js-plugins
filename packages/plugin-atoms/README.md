# @ima/plugin-atoms

The [IMA](https://imajs.io) UI atoms are elementary UI components based on
the [Pattern Lab](http://patternlab.io/) design pattern for creating atomic design
systems.

This package provides various most commonly needed atoms, but both their functionality and
their number are likely to be extended in the future.

The Image, Iframe and Video atoms provide the lazy loading functionality by default.
All the atoms provided by this package are
[AMP HTML](https://www.ampproject.org/)-compatible.

## Installation

```javascript

npm install @ima/plugin-atoms --save

```
## Contributing
Contributing to this repository is done via [Pull-Requests](https://github.com/seznam/IMA.js-ui-atoms/pulls).
Any commit that you make must follow simp

### Changesets
We are using [changesets](https://github.com/changesets/changesets/blob/main/docs/common-questions.md) for version management. 

To simplify the changeset creation process, you can use command 

```
npm run changeset
```

It opens an interactive interface, which should help you with changeset file composition.

### Release
For a new version release of packages, we use changesets, which will automatically bump version and generate changelogs. Following command will initialize interactive guide through the version release per package. Run from root:

```
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

## IMA.js
The [IMA.js](https://imajs.io) is an application development stack for developing
isomorphic applications written in pure JavaScript.
You can find the [IMA.js](https://imajs.io) skeleton application at <https://github.com/seznam/ima>.
