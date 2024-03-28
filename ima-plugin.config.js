const {
  defaultConfig,
  typescriptDeclarationsPlugin,
} = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig[]
 */
module.exports = [
  {
    ...defaultConfig,
    plugins: [
      typescriptDeclarationsPlugin({
        allowFailure: false,
        additionalArgs: ['--skipLibCheck'],
      }),
    ],
  },
];
