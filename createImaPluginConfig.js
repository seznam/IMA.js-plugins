const {
  swcTransformer,
  preprocessTransformer,
  typescriptDefinitionsPlugin
} = require('ima-plugin-cli');

const isProduction = process.env.NODE_ENV === 'production';

const swcTransformers = [
  [
    swcTransformer({
      sourceMaps: true,
      inlineSourcesContent: true,
      isModule: true,
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'ecmascript',
          jsx: true
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
      sourceMaps: true,
      inlineSourcesContent: true,
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'typescript',
          tsx: true
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
      plugins: [typescriptDefinitionsPlugin()]
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
      ],
      plugins: [typescriptDefinitionsPlugin()]
    }
  ];
}

/**
 * @returns import('ima-plugin-cli').BuildConfig[]
 */
function createBasicConfig() {
  return {
    input: './src',
    output: './dist',
    transforms: [...swcTransformers],
    plugins: [typescriptDefinitionsPlugin()]
  };
}

module.exports = { createClientServerConfig, createBasicConfig };
