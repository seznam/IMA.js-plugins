import { ScriptLoaderPlugin } from 'ima-plugin-script-loader';
import FacebookPixelAnalytic from './FacebookPixelAnalytic';

let defaultDependencies = [
  ScriptLoaderPlugin,
  '$Window',
  '$Dispatcher',
  '$Settings.plugin.analytic.fbPixel'
];

let $registerImaPlugin = () => { };

let initBind = (ns, oc) => {
  oc.inject(FacebookPixelAnalytic, defaultDependencies);
};

let initSettings = () => {
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
  initBind,
  initSettings
};
