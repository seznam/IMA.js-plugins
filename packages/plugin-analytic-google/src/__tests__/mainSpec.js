import * as Main from '../main';

describe('Main', () => {
  it('should export $registerImaPlugin', () => {
    expect(typeof Main.$registerImaPlugin).toEqual('function');
  });

  it('should export GoogleAnalytic', () => {
    expect(typeof Main.GoogleAnalytic).toEqual('function');
  });

  it('should export defaultDependencies', () => {
    expect(Array.isArray(Main.defaultDependencies)).toEqual(true);
  });
});
