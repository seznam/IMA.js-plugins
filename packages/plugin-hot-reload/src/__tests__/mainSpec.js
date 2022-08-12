import * as plugin from '../main';

describe('plugin', () => {
  it('export is defined', () => {
    expect(plugin).not.toEqual(null);
    expect(plugin).not.toEqual(undefined);
  });
});
