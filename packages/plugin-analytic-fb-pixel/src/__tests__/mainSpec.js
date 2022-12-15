import * as Main from '../main';

describe('Main', () => {
  it('should export FacebookPixelAnalytic', () => {
    expect(typeof Main.FacebookPixelAnalytic).toBe('function');
  });

  it('should export defaultDependencies', () => {
    expect(Array.isArray(Main.defaultDependencies)).toBe(true);
  });
});
