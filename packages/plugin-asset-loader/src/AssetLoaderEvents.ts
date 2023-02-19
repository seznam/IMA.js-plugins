export enum AssetLoaderEvents {
  /**
   * Fired to dispatcher when loaded. If the script failed to load,
   * it may included `error` in event data.
   */
  LOADED = 'ima.plugin.asset.loader.loaded',
}
