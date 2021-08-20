---
to: packages/<%= h.changeCase.paramCase(name) %>/package.json
---
<% pluginName = h.changeCase.paramCase(name) -%>
<% if (!locals.version){ locals.version = '0.0.1'} -%>
{
  "name": "@ima/<%= pluginName %>",
  "version": "<%= locals.version %>",
  "description": "<%= h.changeCase.sentenceCase(description) %>",
  "main": "dist/main",
  "module": "dist/main",
  "exports": {
      "import": "./dist/main.mjs",
      "require": "./dist/main.cjs"
  },
  "browser": {
    "./dist/main.js": "./dist/main.es5.js",
    "./dist/main.cjs": "./dist/main.es5.js",
    "./dist/main.mjs": "./dist/main.mjs"
  },
  "scripts": {
    "build": "echo \"Release process is supported only via lerna command. See README.md for more info.\"; exit 1",
    "test": "../../node_modules/.bin/jest --coverage --no-watchman --config=jest.config.js",
    "lint": "../../node_modules/.bin/eslint './src/**/*.{js,jsx}' --fix",
    "test:es:version": "../../node_modules/.bin/es-check es5 ./dist/index.es5.js && ../../node_modules/.bin/es-check --module es9 ./dist/index.mjs",
    "doc": "../../node_modules/.bin/gulp doc",
    "prepare": "../../node_modules/.bin/rollup -c"
  },
  "keywords": [
    "IMA.js",
    "plugin"
  ],
  "author": "Miroslav Jancarik <miroslav.jancarik@firma.seznam.cz>",
  "repository": {
    "type": "git",
    "url": "https://github.com/seznam/IMA.js-plugins.git"
  },
  "publishConfig": {
    "registry": "http://registry.npmjs.org/",
    "access": "public"
  },
  "bugs": {
    "url": "https://github.com/seznam/IMA.js-plugins/issues"
  },
  "license": "MIT",
  "devDependencies": {
    "enzyme": "3.11.0",
    "enzyme-adapter-react-16": "^1.15.1",
    "enzyme-to-json": "^3.4.3",
    "@ima/core": "^17.4.0",
    "react": "16.12.0",
    "react-dom": "16.12.0",
    "to-mock": "^1.5.4"
  },
  "browserify": {
    "transform": [
      "babelify"
    ]
  },
  "peerDependencies": {
    "@ima/core": "17.x",
    "react": "16.x"
  },
  "engines": {
    "node": ">=6",
    "npm": ">=4"
  }
}
