import './types';
import { pluginLoader, ComponentUtils } from '@ima/core';

import { Events } from './Events';
import { ScriptLoader } from './ScriptLoader';

const defaultDependencies = ScriptLoader.$dependencies;

pluginLoader.register('@ima/plugin-script-loader', () => ({
  initBind: (ns, oc) => {
    oc.get(ComponentUtils).register(
      'ScriptLoader',
      ScriptLoader,
      '@ima/plugin-script-loader'
    );

    /**
     * Deprecated use 'ScriptLoader' instead, this is here
     * for backwards compatibility.
     */
    oc.get(ComponentUtils).register(
      'ScriptLoaderPlugin',
      ScriptLoader,
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
