import './types';
import { pluginLoader, ComponentUtils } from '@ima/core';

import { Events } from './Events';
import StyleLoader from './StyleLoader';

const defaultDependencies = StyleLoader.$dependencies;

pluginLoader.register('@ima/plugin-style-loader', () => ({
  initBind: (ns, oc) => {
    oc.get(ComponentUtils).register(
      StyleLoader,
      undefined,
      '@ima/plugin-style-loader'
    );
  },
}));

export {
  // @deprecated alias don't use
  StyleLoader as StyleLoaderPlugin,
  StyleLoader,
  Events,
  defaultDependencies,
};
