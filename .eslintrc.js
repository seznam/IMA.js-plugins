module.exports = {
  root: true,
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
  ],
  extends: [
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // JSDoc plugin
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-returns-check': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/tag-lines': 'off',

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
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  globals: {
    $Debug: true,
    $IMA: true,
    chrome: true,
    FB: true,
  },
  overrides: [
    // Typescript support
    {
      files: ['**/*.{ts,tsx}'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            ignoreRestSiblings: true,
            args: 'none',
          },
        ],
        '@typescript-eslint/ban-ts-comment': [
          'error',
          { 'ts-expect-error': 'off' },
        ],
        '@typescript-eslint/no-namespace': [
          'error',
          { allowDeclarations: true },
        ],
      },
    },
  ],
};
