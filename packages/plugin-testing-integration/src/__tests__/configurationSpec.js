import { getConfig, setConfig } from '../configuration';

describe('Configuration', () => {
  it('can get config with default values', () => {
    expect(getConfig()).toEqual(expect.any(Object));
  });

  it('can set config', () => {
    const config = { key: 'value' };

    setConfig(config);

    expect(getConfig().key).toBe('value');
  });
});
