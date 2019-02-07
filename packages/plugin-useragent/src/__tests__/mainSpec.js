import * as Main from '../main';

describe('Main', () => {
  it('should has Client user-agent class', () => {
    expect(typeof Main.ClientUserAgent === 'function').toEqual(true);
  });

  it('should has Server user-agent class', () => {
    expect(typeof Main.ServerUserAgent === 'function').toEqual(true);
  });

  it('should has UserAgent class', () => {
    expect(typeof Main.UserAgent === 'function').toEqual(true);
  });

  it('should has PlatformJS included', () => {
    expect(typeof Main.PlatformJS === 'object').toEqual(true);
  });
});
