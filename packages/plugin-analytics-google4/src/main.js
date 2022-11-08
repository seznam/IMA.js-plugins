import GoogleAnalytics4 from './GoogleAnalytics4';

const defaultDependencies = GoogleAnalytics4.$dependencies;

const $registerImaPlugin = () => {};

const initSettings = () => {
  return {
    prod: {
      plugin: {
        analytic: {
          google4: {
            service: 'G-XXXXXXXXXX'
          }
        }
      }
    },

    test: {},

    dev: {}
  };
};

export {
  GoogleAnalytics4,
  defaultDependencies,
  initSettings,
  $registerImaPlugin
};
