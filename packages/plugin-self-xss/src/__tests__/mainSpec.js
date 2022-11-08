import * as plugin from '../main';

describe('plugin', () => {
  it('should is exported', () => {
    expect(plugin).not.toBeNull();
    expect(plugin).toBeDefined();
  });

  it('should has SelfXSS class', () => {
    expect(plugin.SelfXSS).not.toBeNull();
    expect(plugin.SelfXSS).toBeDefined();
  });
});
