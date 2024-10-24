const babelParser = require('@babel/eslint-parser');
const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const jest = require('eslint-plugin-jest');
const jsdoc = require('eslint-plugin-jsdoc');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const reactPlugin = require('eslint-plugin-react');
const globals = require('globals');
const typescriptEslint = require('typescript-eslint');

module.exports = typescriptEslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
    ],
  },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  jest.configs['flat/recommended'],
  jest.configs['flat/style'],
  importPlugin.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  jsdoc.configs['flat/recommended-typescript-flavor'],
  {
    rules: {
      // JSDoc plugin
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-check': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/tag-lines': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-param-type': 'off',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],

      // Prettier
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          jsxSingleQuote: true,
          bracketSameLine: false,
          arrowParens: 'avoid',
        },
      ],

      // Jest plugin overrides
      'jest/valid-title': 'off',
      'jest/no-done-callback': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jest/no-conditional-expect': 'warn',
      'jest/prefer-expect-resolves': 'warn',
      'jest/prefer-lowercase-title': [
        'warn',
        {
          ignore: ['describe'],
        },
      ],

      // React plugin overrides
      'react/prop-types': 'off',

      // Import plugin
      'import/no-unresolved': [
        'warn',
        {
          ignore: [
            '^@\\/', // ignore @/* aliases
            '@(docusaurus|theme)',
          ],
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: '{preact|react|svelte|docusaurus|theme}{/**,**}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '*.{css,less,json,html,txt,csv,png,jpg,svg}',
              group: 'object',
              patternOptions: { matchBase: true },
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      react: {
        version: '18',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.json'],
        },
      },
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        $Debug: true,
        $IMA: true,
        chrome: true,
        FB: true,
      },
    },
  },
  // Typescript support
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...typescriptEslint.configs.recommended],
    languageOptions: {
      ...typescriptEslint.configs.recommended.languageOptions,
      parserOptions: {
        project: [
          './tsconfig.json',
          './apps/*/tsconfig.json',
          './packages/*/tsconfig.json',
        ],
      },
    },
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      'dot-notation': 'off',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': false },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'none',
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    },
  }
);
