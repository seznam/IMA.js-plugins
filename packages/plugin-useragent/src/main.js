import UserAgent from './AbstractUserAgent.js';
import ClientUserAgent from './ClientUserAgent.js';
import ServerUserAgent from './ServerUserAgent.js';
import PlatformJS from 'platform';

var $registerImaPlugin = () => {};

let initBind = (ns, oc) => {
  if (oc.get('$Window').isClient()) {
    oc.provide(UserAgent, ClientUserAgent, [PlatformJS, '$Window']);
  } else {
    oc.provide(UserAgent, ServerUserAgent, [PlatformJS, '$Request']);
  }
};

let initServices = (ns, oc) => {
  oc.get(UserAgent).init();
};

export {
  ClientUserAgent,
  ServerUserAgent,
  UserAgent,
  PlatformJS,
  $registerImaPlugin,
  initBind,
  initServices
};
