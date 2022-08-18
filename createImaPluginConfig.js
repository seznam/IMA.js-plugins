const {
  swcTransformer,
  preprocessTransformer,
  typescriptDeclarationsPlugin
} = require('ima-plugin-cli');

const isProduction = process.env.NODE_ENV === 'production';

const swcTransformers = [
  [
    swcTransformer({
      isModule: true,
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'ecmascript',
          jsx: true,
          decorators: false,
          dynamicImport: true
        },
        transform: {
          react: {
            useBuiltins: true,
            development: !isProduction
          }
        }
      }
    }),
    { test: /\.(js|jsx)$/ }
  ],
  [
    swcTransformer({
      isModule: true,
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: false,
          dynamicImport: true
        },
        transform: {
          react: {
            useBuiltins: true,
            development: !isProduction
          }
        }
      }
    }),
    { test: /\.(ts|tsx)$/ }
  ]
];

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
        ...swcTransformers
      ],
      plugins: [typescriptDeclarationsPlugin()]
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
        ...swcTransformers
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
    transforms: [...swcTransformers],
    plugins: [typescriptDeclarationsPlugin()]
  };
}

module.exports = { createClientServerConfig, createConfig };
