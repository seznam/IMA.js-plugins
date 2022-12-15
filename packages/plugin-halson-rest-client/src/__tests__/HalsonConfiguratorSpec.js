import HalsonConfigurator from '../HalsonConfigurator';

describe('HalsonConfigurator', () => {
  const API_ROOT = 'http://localhost/api';
  const LINK_MAP_RESOLVER = body => body._links;

  it('should fetch the configuration', async () => {
    let httpAgent = {
      get(url) {
        expect(url).toBe(API_ROOT + '/');
        return Promise.resolve({
          status: 200,
          body: { _links: { stuff: 'stuff too' } },
          params: {
            method: 'GET',
            url,
            transformedUrl: url,
            data: {},
            headers: {},
          },
          headers: {},
          cached: false,
        });
      },
    };

    let configurator = new HalsonConfigurator(
      httpAgent,
      API_ROOT,
      LINK_MAP_RESOLVER
    );

    let conf = await configurator.getConfiguration();

    expect(conf).toEqual({
      links: { stuff: 'stuff too' },
      apiRoot: API_ROOT,
    });
  });
});
