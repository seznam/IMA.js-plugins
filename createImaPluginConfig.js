/* eslint-disable jsdoc/require-jsdoc */
const {
  swcTransformer,
  preprocessTransformer,
  typescriptDeclarationsPlugin
} = require('ima-plugin-cli');

const isProduction = process.env.NODE_ENV === 'production';

function createSwcTransformer(options = {}) {
  const optionsWithDefaults = {
    type: 'es6',
    syntax: 'ecmascript',
    target: 'es2022',
    ...options
  };

  return swcTransformer({
    isModule: true,
    module: {
      type: optionsWithDefaults.type
    },
    jsc: {
      target: optionsWithDefaults.target,
      parser: {
        syntax: optionsWithDefaults.syntax,
        decorators: false,
        dynamicImport: true,
        [optionsWithDefaults.syntax === 'typescript' ? 'tsx' : 'jsx']: true
      },
      transform: {
        react: {
          useBuiltins: true,
          development: !isProduction
        }
      }
    }
  });
}

function createSwcTransformers(options = {}) {
  return [
    [createSwcTransformer(options), { test: /\.(js|jsx)$/ }],
    [
      createSwcTransformer({ ...options, syntax: 'typescript' }),
      { test: /\.(ts|tsx)$/ }
    ]
  ];
}

/**
 * @returns import('ima-plugin-cli').BuildConfig[]
 */
function createClientServerConfig() {
  return [
    {
      input: './src',
      output: './dist/client',
      transforms: [
        preprocessTransformer({ context: { client: true, server: false } }),
        ...createSwcTransformers()
      ],
      plugins: [
        typescriptDeclarationsPlugin({
          additionalArgs: ['--skipLibCheck']
        })
      ]
    },
    {
      input: './src',
      output: './dist/server',
      transforms: [
        preprocessTransformer({
          context: {
            client: false,
            server: true
          }
        }),
        ...createSwcTransformers()
      ]
    }
  ];
}

/**
 * @returns import('ima-plugin-cli').BuildConfig
 */
function createConfig() {
  return {
    input: './src',
    output: './dist',
    transforms: createSwcTransformers(),
    plugins: [
      typescriptDeclarationsPlugin({
        additionalArgs: ['--skipLibCheck']
      })
    ]
  };
}

/**
 * @returns import('ima-plugin-cli').BuildConfig
 */
function createNodeConfig() {
  return {
    input: './src',
    output: './dist',
    transforms: createSwcTransformers({ type: 'commonjs' }),
    plugins: [
      typescriptDeclarationsPlugin({
        additionalArgs: ['--skipLibCheck']
      })
    ]
  };
}

module.exports = { createClientServerConfig, createConfig, createNodeConfig };
