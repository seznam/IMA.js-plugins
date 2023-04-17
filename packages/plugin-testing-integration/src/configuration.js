let configuration = {
  appMainPath: 'app/main.js',
  rootDir: process.cwd(),
  masterElementId: 'page',
  protocol: 'https:',
  host: 'imajs.io',
  environment: 'test',
  locale: 'en',
  TestPageRenderer: null,
  initSettings: () => {},
  initBindApp: () => {},
  initServicesApp: () => {},
  initRoutes: () => {},
  extendAppObject: () => {},
  prebootScript: () => Promise.resolve(),
  pageScriptEvalFn: script =>
    script &&
    script.text &&
    script.id !== 'ima-runner' &&
    window.eval(script.text),
  processEnvironment: env => env,
  features: {
    popupWindow: false,
  },
};

/**
 * @returns {object} configuration
 */
export function getConfig() {
  return configuration;
}

/**
 * Sets config keys
 *
 * @param {object} config
 */
export function setConfig(config) {
  Object.assign(configuration, config);
}

/**
 * Sets object of features in config
 *
 * @param {object} configFeatures
 */
export function setConfigFeatures(configFeatures) {
  Object.assign(configuration.features, configFeatures);
}
