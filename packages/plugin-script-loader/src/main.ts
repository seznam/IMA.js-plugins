import './types';
import { pluginLoader, ComponentUtils } from '@ima/core';

import { Events } from './Events';
import ScriptLoader from './ScriptLoader';

const defaultDependencies = ScriptLoader.$dependencies;

pluginLoader.register('@ima/plugin-script-loader', () => ({
  initBind: (ns, oc) => {
    oc.get(ComponentUtils).register(
      ScriptLoader,
      undefined,
      '@ima/plugin-script-loader'
    );
  },
}));

export {
  Events,
  ScriptLoader,
  // @deprecated, don't use this alias
  ScriptLoader as ScriptLoaderPlugin,
  defaultDependencies,
};
