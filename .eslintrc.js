module.exports = {
  extends: [
    'eslint:recommended',
    // @TODO Fix jsdoc strings
    // 'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  parser: '@babel/eslint-parser',
  rules: {
    'jsdoc/no-undefined-types': 0,
    'jsdoc/require-param-description': 0,
    'jsdoc/require-returns-description': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        jsxBracketSameLine: true,
        trailingComma: 'none',
        arrowParens: 'avoid'
      }
    ],

    'no-console': [
      'error',
      {
        allow: ['warn', 'error']
      }
    ],

    'react/prop-types': 0,
    'react/wrap-multilines': 0,
    'react/no-deprecated': 0,
    'no-import-assign': 0
  },
  plugins: ['prettier', 'jest', 'react', 'jasmine'],
  settings: {
    ecmascript: 2015,
    jsx: true,
    react: {
      version: '16'
    }
  },
  parserOptions: {
    babelOptions: {
      presets: ['@babel/preset-react']
    },
    requireConfigFile: false,
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jasmine: true,
    'jest/globals': true
  },
  globals: {
    $Debug: true,
    $IMA: true,
    using: true,
    extend: true,
    chrome: true,
    FB: true
  }
};
