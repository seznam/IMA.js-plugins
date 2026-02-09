import { setImaTestingLibraryServerConfig } from '@ima/testing-library/server';

import { getConfig } from './configuration';

/**
 * Configures @ima/testing-library to use plugin-testing-integration configuration.
 * This should be called in jest setupFiles before any tests run.
 *
 * This ensures that the environment is always set to 'test' from our configuration
 * instead of being derived from NODE_ENV, preventing inconsistent test results.
 *
 * @returns {void}
 * @example
 * // In your jest.config.js or jest setupFiles
 * import { setupImaTestingIntegration } from '@ima/plugin-testing-integration/setup';
 * setupImaTestingIntegration();
 */
export function setupImaTestingIntegration() {
  const config = getConfig();

  setImaTestingLibraryServerConfig({
    rootDir: config.rootDir,
    processEnvironment: env => {
      // Force the environment to our configured value, not NODE_ENV
      return {
        ...env,
        $Env: config.environment,
      };
    },
  });
}
