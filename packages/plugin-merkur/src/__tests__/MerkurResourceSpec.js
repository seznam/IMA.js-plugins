import MerkurResource from '../MerkurResource';
import { Cache, HttpAgent } from '@ima/core';
import { toMockedInstance, setGlobalMockMethod } from 'to-mock';

setGlobalMockMethod(jest.fn);

describe('MerkurResource clase', () => {
  let merkurResource = null;
  let http = null;
  let cache = null;

  let url = 'http://example.com/widget';
  let data = {
    containerSelector: '.some-class'
  };
  let options = {};

  let body = {
    name: 'my-widget',
    version: '0.0.1',
    props: {},
    state: {
      counter: 0
    },
    assets: [
      {
        name: 'polyfill.js',
        type: 'script',
        source: {
          es5: 'http://localhost:4444/static/es5/polyfill.31c5090d8c961e43fade.js'
        },
        test: 'return window.fetch'
      },
      {
        name: 'widget.js',
        type: 'script',
        source: {
          es9: 'http://localhost:4444/static/es9/widget.6961af42bfa3596bb147.js',
          es5: 'http://localhost:4444/static/es5/widget.31c5090d8c961e43fade.js'
        },
        attr: {
          async: true,
          'custom-attribute': 'foo'
        }
      },
      {
        name: 'widget.css',
        type: 'stylesheet',
        source:
          'http://localhost:4444/static/es9/widget.814e0cb568c7ddc0725d.css'
      }
    ],
    html: '<div></div>'
  };

  beforeEach(() => {
    http = toMockedInstance(HttpAgent, {
      get() {
        return { body, headers: {}, params: data, status: 200, cached: true };
      }
    });
    cache = toMockedInstance(Cache);
    merkurResource = new MerkurResource(http, cache);
  });

  it('should throw error for not defined containerSelector', async () => {
    await expect(merkurResource.get()).rejects.toThrow(
      "Cannot read property 'containerSelector' of undefined"
    );
  });

  it('should return response from widget API with containerSelector', async () => {
    let response = await merkurResource.get(url, data, options);

    expect(response.body).toMatchSnapshot();
  });

  it('should add default options to widget API', async () => {
    http.get = jest.fn();

    await merkurResource.get(url, data, options);

    expect(http.get.mock.calls[0][2]).toMatchSnapshot();
  });

  it('should remove containerSelector from data', async () => {
    http.get = jest.fn();

    await merkurResource.get(url, data, options);

    expect(http.get.mock.calls[0][1]).toMatchSnapshot();
  });
});
