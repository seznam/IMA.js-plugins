module.exports = {
  root: true,
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**'
  ],
  extends: [
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  parser: '@babel/eslint-parser',
  rules: {
    'jsdoc/no-undefined-types': 0, // This should be probably enabled, but it could break some functionality if implemented correctly
    'jsdoc/require-param-description': 0, // Description is not always needed
    'jsdoc/require-returns-description': 0, // Description is not always needed
    'jsdoc/require-returns-check': 0, // There are abstract classes documenting return value, but actually throwing error if not overriden
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
    es2022: true,
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
  },
  overrides: [
    // Typescript support
    {
      files: ['**/*.{ts,tsx}'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json'
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/ban-ts-comment': [
          'error',
          { 'ts-expect-error': 'allow-with-description' }
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ],
        '@typescript-eslint/no-namespace': [
          'error',
          { allowDeclarations: true }
        ]
      }
    }
  ]
};
