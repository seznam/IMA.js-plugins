import GoogleAnalytic from './GoogleAnalytic.js';

const defaultDependencies = GoogleAnalytic.$dependencies;

const $registerImaPlugin = () => {};

let initSettings = () => {
  return {
    prod: {
      plugin: {
        analytic: {
          google: {
            service: 'UA-XXXXXXX-X',
            settings: {}
          }
        }
      }
    },

    test: {},

    dev: {}
  };
};

export {
  GoogleAnalytic,
  defaultDependencies,
  $registerImaPlugin,
  initSettings
};
