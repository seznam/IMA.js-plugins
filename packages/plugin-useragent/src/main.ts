import { pluginLoader } from '@ima/core';
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
    },
    initServices: (ns, oc) => {
      oc.get(UserAgent).init();
    },
  };
});

export { ClientUserAgent, ServerUserAgent, UserAgent, PlatformJS };
