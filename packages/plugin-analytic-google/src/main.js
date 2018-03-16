import { ScriptLoaderPlugin } from 'ima-plugin-script-loader';
import GoogleAnalytic from './GoogleAnalytic.js';

let defaultDependencies = [
  ScriptLoaderPlugin,
  '$Window',
  '$Dispatcher',
  '$Settings.plugin.analytic.google'
];

let $registerImaPlugin = () => {};

let initBind = (ns, oc) => {
  oc.inject(GoogleAnalytic, defaultDependencies);
};

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
  initBind,
  initSettings
};
