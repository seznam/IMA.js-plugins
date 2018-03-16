import { ScriptLoaderPlugin, Events, defaultDependencies } from '../main';

describe('Main', () => {
  it('should has Events', () => {
    expect(typeof Events.LOADED).toEqual('string');
  });

  it('should has ScriptLoaderPlugin', () => {
    expect(typeof ScriptLoaderPlugin).toEqual('function');
  });

  it('should has defaultDependencies', () => {
    expect(Array.isArray(defaultDependencies)).toEqual(true);
  });
});
