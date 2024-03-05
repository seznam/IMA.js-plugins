import * as Main from '../main';

describe('Main', () => {
  it('should export GoogleAnalytics4', () => {
    expect(typeof Main.GoogleAnalytics4).toBe('function');
  });
});
