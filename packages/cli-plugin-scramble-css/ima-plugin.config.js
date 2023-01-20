const { defaultConfig } = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig[]
 */
module.exports = [
  {
    ...defaultConfig,
    /**
     * We have to built to lowest supported target, since
     * the plugin uses common CLI and Client code, which
     * can't be easily compile to both formats.
     */
    target: 'es2018',
  },
];
