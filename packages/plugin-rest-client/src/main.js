import { pluginLoader } from '@ima/core';

export { default as AbstractResource } from './AbstractResource';
export { default as AbstractService } from './AbstractService';
export { default as Processor } from './Processor';
export { default as RestClient } from './RestClient';

pluginLoader.register('@ima/plugin-rest-client', () => {
  return {
    initBind: (ns, oc) => {
      oc.constant('REST_CLIENT_DEFAULT_PROCESSORS', []);
    },
  };
});
