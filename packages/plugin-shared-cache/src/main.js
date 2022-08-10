import SharedCache from './SharedCache';
import SharedCacheEntry from './SharedCacheEntry';

const $registerImaPlugin = () => {
  // Nothing to do, this is required only for IMA to recognize this npm
  // module as an IMA plugin.
};

export { $registerImaPlugin, SharedCache, SharedCacheEntry };
