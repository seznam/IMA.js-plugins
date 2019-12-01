import * as plugin from '../main';

describe('plugin', () => {
  it('should is exported', () => {
    expect(plugin).not.toEqual(null);
    expect(plugin).not.toEqual(undefined);
  });

  it('should exported initServices', () => {
    expect(plugin.initServices).not.toEqual(null);
    expect(plugin.initServices).not.toEqual(undefined);
    expect(typeof plugin.initServices).toEqual('function');
  });

  it('should exported $registerImaPlugin', () => {
    expect(plugin.$registerImaPlugin).not.toEqual(null);
    expect(plugin.$registerImaPlugin).not.toEqual(undefined);
    expect(typeof plugin.$registerImaPlugin).toEqual('function');
  });
});
