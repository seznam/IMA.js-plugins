import FacebookPixelAnalytic from './FacebookPixelAnalytic';

const defaultDependencies = FacebookPixelAnalytic.$dependencies;

const $registerImaPlugin = () => { };

const initSettings = () => {
  return {
    prod: {
      plugin: {
        analytic: {
          fbPixel: {
            id: null
          }
        }
      }
    },

    test: {},

    dev: {}
  };
};

export {
  FacebookPixelAnalytic,
  defaultDependencies,
  $registerImaPlugin,
  initSettings
};
