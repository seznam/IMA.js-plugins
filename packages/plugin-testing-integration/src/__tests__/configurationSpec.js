import { getConfig, setConfig } from '../configuration';

describe('Configuration', () => {
  it('can get config with default values', () => {
    expect(getConfig()).toEqual(jasmine.any(Object));
  });

  it('can set config', () => {
    const config = { key: 'value' };

    setConfig(config);

    expect(getConfig().key).toEqual('value');
  });
});
