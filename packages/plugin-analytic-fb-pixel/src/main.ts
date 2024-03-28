import { pluginLoader } from '@ima/core';

import {
  FacebookPixelAnalytic,
  type AnalyticFBPixelSettings,
} from './FacebookPixelAnalytic';

pluginLoader.register('@ima/plugin-analytic-google', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        analytic: {
          fbPixel: {
            id: null,
          },
        },
      },
    },
  }),
}));

export type { PluginAnalyticFBPixelSettings } from './types';
export { FacebookPixelAnalytic, type AnalyticFBPixelSettings };
