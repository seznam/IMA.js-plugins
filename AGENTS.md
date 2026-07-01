# AGENTS.md — IMA.js-plugins (`@ima/plugins`)

## Project overview

`@ima/plugins` is a public, multi-package monorepo maintained by Seznam. It
contains the most commonly used plugins for the [IMA.js](https://github.com/seznam/ima)
application development stack (isomorphic JavaScript applications).

Each package is published independently to the public npm registry under the
`@ima/*` scope and follows [Semantic Versioning](https://semver.org/). Plugins
with a major version of `0` are considered not production-ready.

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

## Dependencies

```bash
npm ci
```

Uses **npm workspaces** (`packages/*`). The Node.js version is pinned in
`.nvmrc` (run `nvm use` first). Requires `node>=18` and `npm>=8`.

A `postinstall` hook runs `npm run build`, so installing also builds all
packages via Turborepo.

## Building

```bash
npm run build            # turbo build — builds all packages
```

Each package builds with `ima-plugin build` (from `@ima/plugin-cli`), producing
ESM + CJS bundles and TypeScript declarations into `dist/`. Build outputs are
cached by Turborepo (`turbo.json`).

To develop a single package with rebuild-on-change, run `npm run dev` inside
that package directory.

## Running tests

Jest with the `@swc/jest` transform. Tests live in `__tests__/` folders and are
named `*Spec.js` / `*Spec.jsx`.

```bash
npm run test:all         # Run the entire test suite
npm test                 # Run only tests changed since master (or 'next' in pre-release)
```

Run tests for a single package from its directory:

```bash
cd packages/plugin-http-client
npm test
```

Always run the full suite (`npm run test:all`) after cross-cutting changes.

## Linting & formatting

```bash
npm run lint             # ESLint over **/*.{js,jsx,ts,tsx,mjs}
npm run lint:fix         # ESLint with --fix
npm run stylelint        # Stylelint over **/*.{css,less}
```

ESLint v9 **flat config** (`eslint.config.js`). Prettier is enforced through
ESLint (`eslint-plugin-prettier`), so there is no separate `format` script.

Prettier settings (from `eslint.config.js`):
- single quotes (`singleQuote`, `jsxSingleQuote`)
- semicolons required
- `trailingComma: 'es5'`
- `arrowParens: 'avoid'`
- `bracketSameLine: false`

Other conventions:
- `no-console` allows only `console.warn` / `console.error`.
- Unused vars prefixed with `_` are ignored.

A `precommit` hook (husky + lint-staged) runs ESLint and Stylelint on staged
files — do not bypass it with `--no-verify`.

## Code conventions

- TypeScript, `strict` mode, target **ES2024**, `moduleResolution: NodeNext`
  (see `tsconfig.json`). Declarations are emitted by the build, not by `tsc`.
- Keep the dual ESM/CJS `exports` map in `package.json` consistent when adding
  new entrypoints.
- Never hand-edit anything under `dist/` — it is generated.

## Versioning & releases

This repo uses [Changesets](https://github.com/changesets/changesets) for
versioning and changelog generation, and follows
[Semantic Versioning](https://semver.org/).

```bash
npm run changeset        # Add a changeset describing your change (interactive)
```

**Every PR that changes a package must include a changeset.** The actual
release and release-candidate (pre-release) process is run by maintainers / CI —
see `README.md` for the detailed workflow.

## CI

`.github/workflows/ci.yml` runs on pushes to `master`/`next` and on PRs:
1. `npm run lint`
2. `npm run stylelint`
3. `npm run test:all`

On `master`/`next`, a `release` job publishes packages and creates GitHub
releases. Make sure lint, stylelint, and the full test suite pass locally
before opening a PR.

## Contributing

Contribute via [Pull Requests](https://github.com/seznam/IMA.js-plugins/pulls).
Before submitting:
1. Install with `npm ci`.
2. Add a changeset (`npm run changeset`) for any package change.
3. Ensure `npm run lint`, `npm run stylelint`, and `npm run test:all` pass.
