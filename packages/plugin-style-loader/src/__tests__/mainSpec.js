import { StyleLoaderPlugin, Events, defaultDependencies } from '../main';

describe('Main', () => {
  it('should has Events', () => {
    expect(typeof Events.LOADED).toBe('string');
  });

  it('should has StyleLoaderPlugin', () => {
    expect(typeof StyleLoaderPlugin).toBe('function');
  });

  it('should has defaultDependencies', () => {
    expect(Array.isArray(defaultDependencies)).toBe(true);
  });
});
