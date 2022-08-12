import { pluginLoader } from '@ima/core';
import HotReloadService from './HotReloadService';

pluginLoader.register('@ima/plugin-hot-reload', () => ({
  initServices: (ns, oc) => {
    oc.get(HotReloadService).init();
  }
}));

export { HotReloadService };
