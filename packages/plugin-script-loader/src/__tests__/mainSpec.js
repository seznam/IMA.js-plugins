import { ScriptLoaderPlugin, Events, defaultDependencies } from '../main';

describe('Main', () => {
  it('should has Events', () => {
    expect(typeof Events.LOADED).toBe('string');
  });

  it('should has ScriptLoaderPlugin', () => {
    expect(typeof ScriptLoaderPlugin).toBe('function');
  });

  it('should has defaultDependencies', () => {
    expect(Array.isArray(defaultDependencies)).toBe(true);
  });
});
