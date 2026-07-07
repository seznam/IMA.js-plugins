# AGENTS.md — IMA.js-plugins (`@ima/plugins`)

## Project overview

`@ima/plugins` is a public, multi-package monorepo maintained by Seznam. It
contains the most commonly used plugins for the [IMA.js](https://github.com/seznam/ima)
application development stack (isomorphic JavaScript applications).

Each package is published independently to the public npm registry under the
`@ima/*` scope and follows [Semantic Versioning](https://semver.org/).

## Repository layout

```
packages/                       # All publishable plugins (npm workspaces)
├── cli-plugin-analyze/         # @ima/plugin-cli build-time plugins
├── cli-plugin-legacy-css/
├── cli-plugin-less-constants/
├── cli-plugin-scramble-css/
├── plugin-analytic/            # Runtime IMA.js plugins
├── plugin-analytic-fb-pixel/
├── plugin-analytic-google/
├── plugin-atoms/
├── plugin-halson-rest-client/
├── plugin-http-client/
├── plugin-local-storage/
├── plugin-logger/
├── plugin-managed-component/
├── plugin-merkur/
├── plugin-resource-loader/
├── plugin-rest-client/
├── plugin-script-loader/
├── plugin-select/
├── plugin-self-xss/
├── plugin-shared-cache/
├── plugin-style-loader/
├── plugin-testing-integration/
├── plugin-useragent/
└── plugin-websocket/
.changeset/                     # Changesets config + pending changesets
.github/workflows/ci.yml        # CI: lint, stylelint, tests, release
eslint.config.js                # ESLint v9 flat config (root)
ima-plugin.config.js            # @ima/plugin-cli build config (shared)
jest.config.base.js             # Shared Jest config (SWC transform)
tsconfig.json                   # Shared TS config (ES2024, strict, NodeNext)
turbo.json                      # Turborepo task pipeline
```

### Package structure

Every package under `packages/*` follows the same layout:

```
src/                # Source (TypeScript / JSX)
├── main.ts         # Public entrypoint
├── __tests__/      # Tests, named *Spec.js(x)
└── ...
dist/               # Build output (esm/, cjs/, .d.ts) — generated, do not edit
package.json        # Per-package manifest + build/test/lint scripts
jest.config.js      # Extends ../../jest.config.base.js
tsconfig.json
```

Packages expose dual ESM/CJS builds via the `exports` field, with types in
`dist/esm/main.d.ts`.

## Setup

Assume fixed toolchain versions everywhere; don't check for or support others.

- Node.js **24** (pinned in `.nvmrc`) — run `nvm use` first.

```bash
npm ci
```

A `postinstall` hook runs `npm run build`, so installing also builds all
packages via Turborepo.

## Common commands

```bash
npm run build # build all packages (turbo)
npm run build -w <package-name> # build one package
npm run test # test changed packages
npm run lint # lint all packages
npm run stylelint # lint all less files
```

## Conventions

- **Changesets are mandatory** for every MR.
- TypeScript, `strict` mode, target **ES2024**, `moduleResolution: NodeNext`
  (see `tsconfig.json`). Declarations are emitted by the build, not by `tsc`.
- Keep the dual ESM/CJS `exports` map in `package.json` consistent when adding
  new entrypoints.
- Never hand-edit anything under `dist/` — it is generated.

## Don't

- Don't run `npm install` / `usac reinstall` inside packages.
- Don't bump versions or edit CHANGELOG.md manually — use changesets.
