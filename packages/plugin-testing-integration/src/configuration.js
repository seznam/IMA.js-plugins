let configuration = {
  appMainPath: 'app/main.js',
  appBuildPath: 'app/build.js',
  masterElementId: 'page',
  protocol: 'https:',
  host: 'imajs.io',
  environment: 'test',
  prebootScript: () => Promise.resolve()
};

/**
 * @returns {object} configuration
 */
export function getConfig() {
  return configuration;
}

/**
 * Sets config keys
 * @param {object} config
 */
export function setConfig(config) {
  Object.assign(configuration, config);
}
