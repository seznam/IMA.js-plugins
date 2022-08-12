import * as plugin from '../main';

describe('plugin', () => {
  it('should is exported', () => {
    expect(plugin).not.toEqual(null);
    expect(plugin).not.toEqual(undefined);
  });

  it('should exported WebSocket', () => {
    expect(plugin.WebSocket).not.toEqual(null);
    expect(plugin.WebSocket).not.toEqual(undefined);
    expect(typeof plugin.WebSocket).toEqual('function');
  });
});
