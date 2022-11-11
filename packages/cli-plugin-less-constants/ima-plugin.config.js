const {
  nodeConfig,
  defaultConfig,
  typescriptDeclarationsPlugin,
} = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig[]
 */
module.exports = [
  {
    ...nodeConfig,
    inputDir: './cli-plugin',
    output: [
      {
        dir: './dist/cli-plugin',
        format: 'commonjs',
      },
    ],
    plugins: [],
  },
  {
    ...defaultConfig,
    inputDir: './units',
    output: [
      {
        dir: './dist/units',
        format: 'es6',
      },
    ],
    plugins: [
      typescriptDeclarationsPlugin({
        additionalArgs: ['--skipLibCheck', '--outDir', './dist'],
      }),
    ],
  },
];
