import HotReloadService from './HotReloadService';

const $registerImaPlugin = () => {};

const initServices = (ns, oc) => {
  oc.get(HotReloadService).init();
};

export { initServices, $registerImaPlugin, HotReloadService };
