import './types';
import { ComponentUtils, pluginLoader } from '@ima/core';

import LocalStorage from './LocalStorage';

pluginLoader.register('@ima/plugin-local-storage', () => ({
  initBind: (ns, oc) => {
    oc.get(ComponentUtils).register(
      LocalStorage,
      undefined,
      '@ima/plugin-local-storage'
    );
  },
}));

export { LocalStorage };
