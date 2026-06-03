let configuration = {
  appMainPath: 'app/main.js',
  rootDir: process.cwd(),
  environment: 'test',
  TestPageRenderer: null,
  initSettings: () => {},
  initBindApp: () => {},
  initServicesApp: () => {},
  initRoutes: () => {},
  extendAppObject: () => {},
  prebootScript: () => Promise.resolve(),
};

/**
 * Gets the current plugin configuration.
 *
 * @returns {{
 *   appMainPath: string,
 *   rootDir: string,
 *   environment: string,
 *   TestPageRenderer: any,
 *   initSettings: (...args: any[]) => any,
 *   initBindApp: (...args: any[]) => any,
 *   initServicesApp: (...args: any[]) => any,
 *   initRoutes: (...args: any[]) => any,
 *   extendAppObject: (app: any) => any,
 *   prebootScript: () => Promise<void>
 * }} Plugin configuration object
 */
export function getConfig() {
  return configuration;
}

/**
 * Sets or updates plugin configuration keys.
 *
 * @param {Partial<{
 *   appMainPath: string,
 *   rootDir: string,
 *   environment: string,
 *   TestPageRenderer: any,
 *   initSettings: (...args: any[]) => any,
 *   initBindApp: (...args: any[]) => any,
 *   initServicesApp: (...args: any[]) => any,
 *   initRoutes: (...args: any[]) => any,
 *   extendAppObject: (app: any) => any,
 *   prebootScript: () => Promise<void>
 * }>} config - Configuration object with keys to update
 * @returns {void}
 */
export function setConfig(config) {
  Object.assign(configuration, config);
}
