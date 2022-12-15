import * as plugin from '../main';

describe('plugin', () => {
  it('should is exported', () => {
    expect(plugin).not.toBeNull();
    expect(plugin).toBeDefined();
  });

  it('should exported WebSocket', () => {
    expect(plugin.WebSocket).not.toBeNull();
    expect(plugin.WebSocket).toBeDefined();
    expect(typeof plugin.WebSocket).toBe('function');
  });
});
