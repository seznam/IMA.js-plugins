import * as plugin from '../main';

describe('plugin', () => {
  it('should is exported', () => {
    expect(plugin).not.toEqual(null);
    expect(plugin).not.toEqual(undefined);
  });

  it('should has SelfXSS class', () => {
    expect(plugin.SelfXSS).not.toEqual(null);
    expect(plugin.SelfXSS).not.toEqual(undefined);
  });
});
