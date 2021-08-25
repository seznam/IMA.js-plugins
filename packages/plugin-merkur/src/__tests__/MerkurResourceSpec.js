import MerkurResource from '../MerkurResource';
import { Cache, HttpAgent } from '@ima/core';
import { toMockedInstance, setGlobalMockMethod } from 'to-mock';

setGlobalMockMethod(jest.fn);

describe('MerkurResource class', () => {
  let merkurResource = null;
  let http = null;

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

  describe('default usage', () => {
    beforeEach(() => {
      http = toMockedInstance(HttpAgent, {
        get() {
          return { body, headers: {}, params: data, status: 200, cached: true };
        }
      });

      merkurResource = new MerkurResource(http, toMockedInstance(Cache));
    });

    it('should return response from widget API with containerSelector set to both props and widget', async () => {
      let response = await merkurResource.get(url, data, options);

      expect(response.body).toMatchSnapshot();
      expect(response.body.containerSelector).toBe('.some-class');
      expect(response.body.props.containerSelector).toBe('.some-class');
    });

    it('should add default options to widget API', async () => {
      http.get = jest.fn();

      await merkurResource.get(url, data, options);

      expect(http.get).toHaveBeenCalledWith(
        'http://example.com/widget',
        {},
        { cache: true, method: 'get', ttl: 60000 }
      );
    });

    it('should remove containerSelector from data', async () => {
      http.get = jest.fn();

      await merkurResource.get(url, data, options);

      expect(http.get).toHaveBeenCalledWith(
        'http://example.com/widget',
        {},
        { cache: true, method: 'get', ttl: 60000 }
      );
    });
  });

  describe('slot usage', () => {
    let slotData = {
      ...data,
      slots: {
        headline: {
          containerSelector: '.headline'
        }
      }
    };

    beforeEach(() => {
      http = toMockedInstance(HttpAgent, {
        get() {
          return {
            body: {
              ...body,
              slots: {
                headline: {
                  name: 'headline',
                  html: '<div></div>'
                }
              }
            },
            headers: {},
            params: data,
            status: 200,
            cached: true
          };
        }
      });

      merkurResource = new MerkurResource(http, toMockedInstance(Cache));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should remove slots from request data', async () => {
      http.get = jest.fn();

      await merkurResource.get(url, slotData, options);

      expect(http.get).toHaveBeenCalledWith(
        'http://example.com/widget',
        {},
        { cache: true, method: 'get', ttl: 60000 }
      );
    });

    it('should append container selectors to defined slots', async () => {
      let resource = await merkurResource.get(url, slotData, options);

      expect(resource).toMatchSnapshot();
      expect(resource.body.slots.headline.containerSelector).toBe('.headline');
    });

    it('should not do anything when slots are not used', async () => {
      let resource = await merkurResource.get(url, data, options);

      expect(resource.body.slots.headline.containerSelector).not.toBe(
        '.headline'
      );
    });
  });
});
