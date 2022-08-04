import { pluginLoader } from '@ima/core';
import HotReloadService from './HotReloadService';

const $registerImaPlugin = () => {};

const initServices = (ns, oc) => {
  oc.get(HotReloadService).init();
};

pluginLoader.register('@ima/plugin-hot-reload', () => {
  $registerImaPlugin();

  return { initServices };
});

export { initServices, $registerImaPlugin, HotReloadService };
