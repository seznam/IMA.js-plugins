import * as Main from '../main';

describe('Main', () => {
  it('should export GoogleAnalytic', () => {
    expect(typeof Main.GoogleAnalytics4).toBe('function');
  });

  it('should export defaultDependencies', () => {
    expect(Array.isArray(Main.defaultDependencies)).toBe(true);
  });
});
