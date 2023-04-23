const { defaultConfig, preprocessTransformer } = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig
 */
module.exports = [
  {
    ...defaultConfig,
    inputDir: './src',
    transformers: [
      preprocessTransformer({
        context: {
          production: true,
          development: false,
        },
      }),
      '...',
    ],
    output: [
      {
        dir: './dist/production/esm',
        format: 'es6',
      },
      {
        dir: './dist/production/cjs',
        format: 'commonjs',
      },
    ],
    plugins: [],
  },
  {
    ...defaultConfig,
    inputDir: './src',
    transformers: [
      preprocessTransformer({
        context: {
          production: false,
          development: true,
        },
      }),
      '...',
    ],
    output: [
      {
        dir: './dist/development/esm',
        format: 'es6',
      },
      {
        dir: './dist/development/cjs',
        format: 'commonjs',
      },
    ],
    additionalWatchPaths: ['./index.cjs', './index.mjs'],
  },
];
