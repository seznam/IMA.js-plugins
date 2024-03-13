import './types';
import { pluginLoader, ComponentUtils } from '@ima/core';
import PlatformJS from 'platform';

import UserAgent from './AbstractUserAgent';
import ClientUserAgent from './ClientUserAgent';
import ServerUserAgent from './ServerUserAgent';

pluginLoader.register('@ima/plugin-useragent', () => {
  return {
    initBind: (ns, oc) => {
      if (oc.get('$Window').isClient()) {
        oc.provide(UserAgent, ClientUserAgent, [PlatformJS, '$Window']);
      } else {
        oc.provide(UserAgent, ServerUserAgent, [PlatformJS, '$Request']);
      }

      oc.get(ComponentUtils).register(
        UserAgent,
        undefined,
        '@ima/plugin-useragent'
      );
    },
    initServices: (ns, oc) => {
      oc.get(UserAgent).init();
    },
  };
});

export { ClientUserAgent, ServerUserAgent, UserAgent, PlatformJS };
