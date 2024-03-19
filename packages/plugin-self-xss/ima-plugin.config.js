const {
  clientServerConfig,
  typescriptDeclarationsPlugin,
} = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig[]
 */
module.exports = [
  {
    ...clientServerConfig,
    plugins: [
      typescriptDeclarationsPlugin({
        allowFailure: false,
        additionalArgs: ['--skipLibCheck'],
      }),
    ],
  },
];
