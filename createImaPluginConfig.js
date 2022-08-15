const { preprocessTransformer } = require('ima-plugin-cli');
const { swcTransformer } = require('ima-plugin-cli');

const isProduction = process.env.NODE_ENV === 'production';

const swcTransform = swcTransformer({
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
});

/**
 * @returns import('ima-plugin-cli').BuildConfig[]
 */
function createClientServerConfig() {
  return [
    {
      input: './src',
      output: './dist/client',
      skipTransform: [/\.(css|less)/],
      transforms: [
        preprocessTransformer({ context: { client: true, server: false } }),
        [swcTransform, { test: /\.(js|jsx)/ }]
      ]
    },
    {
      input: './src',
      output: './dist/server',
      skipTransform: [/\.(css|less)/],
      transforms: [
        preprocessTransformer({
          context: {
            client: false,
            server: true
          }
        }),
        [swcTransform, { test: /\.(js|jsx)/ }]
      ]
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
    skipTransform: [/\.(css|less)/],
    transforms: [[swcTransform, { test: /\.(js|jsx)/ }]]
  };
}

module.exports = { createClientServerConfig, createBasicConfig };
