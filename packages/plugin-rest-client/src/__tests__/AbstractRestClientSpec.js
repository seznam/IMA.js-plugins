import AbstractEntity from '../AbstractEntity';
import AbstractRestClient from '../AbstractRestClient';
import Configurator from '../Configurator';
import LinkGenerator from '../LinkGenerator';
import Request from '../Request';
import RequestPreProcessor from '../RequestPreProcessor';
import Response from '../Response';
import ResponsePostProcessor from '../ResponsePostProcessor';

describe('AbstractRestClient', () => {
  class DummyRestClient extends AbstractRestClient {}

  class DummyLinkGenerator extends LinkGenerator {
    createLink(parentEntity, resource) {
      if (resource.prototype instanceof AbstractEntity) {
        resource = resource.resourceName;
      }

      return `http://server.api/${resource}`;
    }
  }

  class DummyHttpAgent {
    get(url, data, options) {
      return Promise.resolve({
        status: 200,
        body: { stuff: 'stuff too' },
        params: {
          method: 'GET',
          url,
          transformedUrl: url,
          data,
          headers: options.headers,
        },
        headers: {},
        cached: false,
      });
    }

    post(url, data, options) {
      return this.get(url, data, options);
    }

    put(url, data, options) {
      return this.get(url, data, options);
    }

    patch(url, data, options) {
      return this.get(url, data, options);
    }

    delete(url, data, options) {
      return this.get(url, data, options);
    }
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should follow the correct call chain', async () => {
    let configuratorCalled = false;
    let linkGeneratorCalled = false;
    let preProcessor1Called = false;
    let preProcessor2Called = false;
    let agentCalled = false;
    let postProcessor1Called = false;
    let postProcessor2Called = false;

    let agentMock = {
      get(url, data, options) {
        expect(preProcessor2Called).toBe(true);
        expect(agentCalled).toBe(false);
        agentCalled = true;

        expect(url).toBe('http://foo.bar/baz?id=yup');
        // all query parameters are processed by the link generator
        expect(data).toEqual({});
        expect(options).toEqual({
          headers: {
            'Custom-Header': 'stuff',
          },
          withCredentials: true,
        });

        return Promise.resolve({
          status: 206,
          body: { stuff: 3.141592653598 },
          params: {
            method: 'GET',
            url,
            transformedUrl: url,
            data,
            headers: options.headers,
          },
          headers: {
            'Other-Header': 'other stuff',
          },
          cached: false,
        });
      },
    };

    let configuratorMock = new (class extends Configurator {
      getConfiguration() {
        expect(configuratorCalled).toBe(false);
        configuratorCalled = true;
        return Promise.resolve({ configGenerated: true });
      }
    })();

    let linkGeneratorMock = new (class extends LinkGenerator {
      createLink(parentEntity, resource, id, parameters, serverConfig) {
        expect(configuratorCalled).toBe(true);
        expect(linkGeneratorCalled).toBe(false);
        linkGeneratorCalled = true;

        expect(parentEntity).toEqual({ stuff: 'yeah', someId: 321 });
        expect(resource).toBe('foo');
        expect(id).toBe(123);
        expect(parameters).toEqual({ bar: 'baz', two: 2 });
        expect(serverConfig).toEqual({ configGenerated: true });

        return 'https+something://foo.bar/baz/xyz';
      }
    })();

    let preProcessorMock1 = new (class extends RequestPreProcessor {
      process(request) {
        expect(linkGeneratorCalled).toBe(true);
        expect(preProcessor1Called).toBe(false);
        preProcessor1Called = true;

        expect(request.parentEntity).toEqual({
          stuff: 'yeah',
          someId: 321,
        });
        expect(request.resource).toBe('foo');
        expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
        expect(request.method).toBe('GET');
        expect(request.url).toBe('https+something://foo.bar/baz/xyz');
        expect(request.data).toBeNull();
        expect(request.headers).toEqual({
          'Custom-Header': 'stuff',
        });
        expect(request.options).toEqual({
          withCredentials: true,
        });
        expect(request.serverConfiguration).toEqual({
          configGenerated: true,
        });

        return new Request(
          Object.assign({}, request, {
            url: 'http://foo.bar/baz?id=nope',
          })
        );
      }
    })();

    let preProcessorMock2 = new (class extends RequestPreProcessor {
      process(request) {
        expect(preProcessor1Called).toBe(true);
        expect(preProcessor2Called).toBe(false);
        preProcessor2Called = true;

        expect(request.parentEntity).toEqual({
          stuff: 'yeah',
          someId: 321,
        });
        expect(request.resource).toBe('foo');
        expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
        expect(request.method).toBe('GET');
        expect(request.url).toBe('http://foo.bar/baz?id=nope');
        expect(request.data).toBeNull();
        expect(request.headers).toEqual({
          'Custom-Header': 'stuff',
        });
        expect(request.options).toEqual({
          withCredentials: true,
        });
        expect(request.serverConfiguration).toEqual({
          configGenerated: true,
        });

        return new Request(
          Object.assign({}, request, {
            url: 'http://foo.bar/baz?id=yup',
          })
        );
      }
    })();

    let postProcessorMock1 = new (class extends ResponsePostProcessor {
      process(response) {
        expect(agentCalled).toBe(true);
        expect(postProcessor1Called).toBe(false);
        postProcessor1Called = true;

        expect(response.status).toBe(206);
        expect(response.headers).toEqual({
          'Other-Header': 'other stuff',
        });
        expect(response.body).toEqual({ stuff: 3.141592653598 });
        expect(response.cached).toBe(false);
        let request = response.request;
        expect(request.parentEntity).toEqual({
          stuff: 'yeah',
          someId: 321,
        });
        expect(request.resource).toBe('foo');
        expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
        expect(request.method).toBe('GET');
        expect(request.url).toBe('http://foo.bar/baz?id=yup');
        expect(request.data).toBeNull();
        expect(request.headers).toEqual({
          'Custom-Header': 'stuff',
        });
        expect(request.options).toEqual({
          withCredentials: true,
        });
        expect(request.serverConfiguration).toEqual({
          configGenerated: true,
        });

        return new Response(
          Object.assign({}, response, {
            status: 200,
          })
        );
      }
    })();

    let postProcessorMock2 = new (class extends ResponsePostProcessor {
      process(response) {
        expect(postProcessor1Called).toBe(true);
        expect(postProcessor2Called).toBe(false);
        postProcessor2Called = true;

        expect(response.status).toBe(200);
        expect(response.headers).toEqual({
          'Other-Header': 'other stuff',
        });
        expect(response.body).toEqual({ stuff: 3.141592653598 });
        expect(response.cached).toBe(false);
        let request = response.request;
        expect(request.parentEntity).toEqual({
          stuff: 'yeah',
          someId: 321,
        });
        expect(request.resource).toBe('foo');
        expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
        expect(request.method).toBe('GET');
        expect(request.url).toBe('http://foo.bar/baz?id=yup');
        expect(request.data).toBeNull();
        expect(request.headers).toEqual({
          'Custom-Header': 'stuff',
        });
        expect(request.options).toEqual({
          withCredentials: true,
        });
        expect(request.serverConfiguration).toEqual({
          configGenerated: true,
        });

        return new Response(
          Object.assign({}, response, {
            status: 203,
          })
        );
      }
    })();

    let client = new DummyRestClient(
      agentMock,
      configuratorMock,
      linkGeneratorMock,
      [preProcessorMock1, preProcessorMock2],
      [postProcessorMock1, postProcessorMock2]
    );

    let response = await client.get(
      'foo',
      123,
      { bar: 'baz', two: 2 },
      {
        headers: {
          'Custom-Header': 'stuff',
        },
        withCredentials: true,
      },
      { stuff: 'yeah', someId: 321 }
    );

    expect(postProcessor2Called).toBe(true);
    expect(response.status).toBe(203);
    expect(response.headers).toEqual({
      'Other-Header': 'other stuff',
    });
    expect(response.body).toEqual({ stuff: 3.141592653598 });
    expect(response.cached).toBe(false);
    let request = response.request;
    expect(request.parentEntity).toEqual({
      stuff: 'yeah',
      someId: 321,
    });
    expect(request.resource).toBe('foo');
    expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
    expect(request.method).toBe('GET');
    expect(request.url).toBe('http://foo.bar/baz?id=yup');
    expect(request.data).toBeNull();
    expect(request.headers).toEqual({
      'Custom-Header': 'stuff',
    });
    expect(request.options).toEqual({
      withCredentials: true,
    });
    expect(request.serverConfiguration).toEqual({
      configGenerated: true,
    });
  });

  it(
    'should follow the correct call chain when no configurator, ' +
      'pre-processors, or post-processors are set',
    async () => {
      let linkGeneratorCalled = false;
      let agentCalled = false;

      let agentMock = {
        get(url, data, options) {
          expect(linkGeneratorCalled).toBe(true);
          expect(agentCalled).toBe(false);
          agentCalled = true;

          expect(url).toBe('https+something://foo.bar/baz/xyz');
          // all query parameters are processed by the link generator
          expect(data).toEqual({});
          expect(options).toEqual({
            headers: {
              'Custom-Header': 'stuff',
            },
            withCredentials: true,
          });

          return Promise.resolve({
            status: 200,
            body: { stuff: 'yup' },
            params: {
              method: 'GET',
              url,
              transformedUrl: url,
              data,
              headers: options.headers,
            },
            headers: {
              'Other-Header': 'other stuff',
            },
            cached: false,
          });
        },
      };

      let linkGeneratorMock = new (class extends LinkGenerator {
        createLink(parentEntity, resource, id, parameters, serverConfig) {
          expect(linkGeneratorCalled).toBe(false);
          linkGeneratorCalled = true;

          expect(parentEntity).toEqual({ stuff: 'yeah', someId: 321 });
          expect(resource).toBe('foo');
          expect(id).toBe(123);
          expect(parameters).toEqual({ bar: 'baz', two: 2 });
          expect(serverConfig).toBeNull();

          return 'https+something://foo.bar/baz/xyz';
        }
      })();

      let client = new DummyRestClient(
        agentMock,
        null,
        linkGeneratorMock,
        [],
        []
      );

      let response = await client.get(
        'foo',
        123,
        { bar: 'baz', two: 2 },
        {
          headers: {
            'Custom-Header': 'stuff',
          },
          withCredentials: true,
        },
        { stuff: 'yeah', someId: 321 }
      );

      expect(agentCalled).toBe(true);
      expect(response.status).toBe(200);
      expect(response.headers).toEqual({
        'Other-Header': 'other stuff',
      });
      expect(response.body).toEqual({ stuff: 'yup' });
      expect(response.cached).toBe(false);
      let request = response.request;
      expect(request.parentEntity).toEqual({
        stuff: 'yeah',
        someId: 321,
      });
      expect(request.resource).toBe('foo');
      expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
      expect(request.method).toBe('GET');
      expect(request.url).toBe('https+something://foo.bar/baz/xyz');
      expect(request.data).toBeNull();
      expect(request.headers).toEqual({
        'Custom-Header': 'stuff',
      });
      expect(request.options).toEqual({
        withCredentials: true,
      });
      expect(request.serverConfiguration).toBeNull();
    }
  );

  it('should call configurator only once', async () => {
    let callCount = 0;

    let configurator = new (class extends Configurator {
      getConfiguration() {
        callCount++;
        return Promise.resolve({ configGenerated: true });
      }
    })();

    let restClient = new DummyRestClient(
      new DummyHttpAgent(),
      configurator,
      new DummyLinkGenerator(),
      [],
      []
    );

    await restClient.get('foo', 1).then(() => {
      return restClient.get('bar', 2);
    });

    expect(callCount).toBe(1);
  });

  it('should allow preProcessors to generate a response', async () => {
    let preProcessorCalled = false;
    let agentCalled = false;
    let postProcessorCalled = false;

    let preProcessor = new (class extends RequestPreProcessor {
      process(request) {
        expect(preProcessorCalled).toBe(false);
        preProcessorCalled = true;

        return new Response({
          status: 201,
          headers: {},
          body: null,
          cached: false,
          request,
        });
      }
    })();

    let agent = new (class extends DummyHttpAgent {
      get() {
        throw new Error('The HTTP agent must not be invoked');
      }
    })();

    let postProcessor = new (class extends ResponsePostProcessor {
      process(response) {
        expect(preProcessorCalled).toBe(true);
        expect(agentCalled).toBe(false);
        expect(postProcessorCalled).toBe(false);
        postProcessorCalled = true;

        expect(response.status).toBe(201);
        expect(response.headers).toEqual({});
        expect(response.body).toBeNull();
        expect(response.cached).toBe(false);

        return new Response(
          Object.assign({}, response, {
            status: 204,
          })
        );
      }
    })();

    let restClient = new DummyRestClient(
      agent,
      null,
      new DummyLinkGenerator(),
      [preProcessor],
      [postProcessor]
    );

    const response = await restClient.get('foo', 1);

    expect(postProcessorCalled).toBe(true);
    expect(agentCalled).toBe(false);
    expect(response.status).toBe(204);
  });

  it('should allow preProcessors to generate a promise of a response', async () => {
    let preProcessorCalled = false;
    let agentCalled = false;
    let postProcessorCalled = false;

    let preProcessor = new (class extends RequestPreProcessor {
      process(request) {
        expect(preProcessorCalled).toBe(false);
        preProcessorCalled = true;

        return Promise.resolve(
          new Response({
            status: 201,
            headers: {},
            body: null,
            cached: false,
            request,
          })
        );
      }
    })();

    let agent = new (class extends DummyHttpAgent {
      get() {
        throw new Error('The HTTP agent must not be invoked');
      }
    })();

    let postProcessor = new (class extends ResponsePostProcessor {
      process(response) {
        expect(preProcessorCalled).toBe(true);
        expect(agentCalled).toBe(false);
        expect(postProcessorCalled).toBe(false);
        postProcessorCalled = true;

        expect(response.status).toBe(201);
        expect(response.headers).toEqual({});
        expect(response.body).toBeNull();
        expect(response.cached).toBe(false);

        return new Response(
          Object.assign({}, response, {
            status: 204,
          })
        );
      }
    })();

    let restClient = new DummyRestClient(
      agent,
      null,
      new DummyLinkGenerator(),
      [preProcessor],
      [postProcessor]
    );

    let response = await restClient.get('foo', 1);

    expect(postProcessorCalled).toBe(true);
    expect(agentCalled).toBe(false);
    expect(response.status).toBe(204);
  });

  it('should execute a GET request when list() is called', async () => {
    let methodCalled = false;

    let restClient = new DummyRestClient(
      new (class extends DummyHttpAgent {
        get(url, data, options) {
          expect(methodCalled).toBe(false);
          methodCalled = true;
          return super.get(url, data, options);
        }
      })(),
      null,
      new DummyLinkGenerator(),
      [],
      []
    );

    await restClient.list('foo');

    expect(methodCalled).toBe(true);
  });

  it('should execute a GET request when get() is called', async () => {
    let methodCalled = false;

    let restClient = new DummyRestClient(
      new (class extends DummyHttpAgent {
        get(url, data, options) {
          expect(methodCalled).toBe(false);
          methodCalled = true;
          return super.get(url, data, options);
        }
      })(),
      null,
      new DummyLinkGenerator(),
      [],
      []
    );

    await restClient.get('foo', 1);

    expect(methodCalled).toBe(true);
  });

  it('should execute a PATCH request when patch() is called', async () => {
    let methodCalled = false;

    let restClient = new DummyRestClient(
      new (class extends DummyHttpAgent {
        patch(url, data, options) {
          expect(methodCalled).toBe(false);
          methodCalled = true;
          return super.patch(url, data, options);
        }
      })(),
      null,
      new DummyLinkGenerator(),
      [],
      []
    );

    await restClient.patch('foo', 1, {});

    expect(methodCalled).toBe(true);
  });

  it('should execute a PUT request when replace() is called', async () => {
    let methodCalled = false;

    let restClient = new DummyRestClient(
      new (class extends DummyHttpAgent {
        put(url, data, options) {
          expect(methodCalled).toBe(false);
          methodCalled = true;
          return super.put(url, data, options);
        }
      })(),
      null,
      new DummyLinkGenerator(),
      [],
      []
    );

    await restClient.replace('foo', 1, {});
    expect(methodCalled).toBe(true);
  });

  it('should execute a POST request when create() is called', async () => {
    let methodCalled = false;

    let restClient = new DummyRestClient(
      new (class extends DummyHttpAgent {
        post(url, data, options) {
          expect(methodCalled).toBe(false);
          methodCalled = true;
          return super.get(url, data, options);
        }
      })(),
      null,
      new DummyLinkGenerator(),
      [],
      []
    );

    await restClient.create('foo', {});
    expect(methodCalled).toBe(true);
  });

  it('should execute a DELETE request when delete() is called', async () => {
    let methodCalled = false;

    let restClient = new DummyRestClient(
      new (class extends DummyHttpAgent {
        delete(url, data, options) {
          expect(methodCalled).toBe(false);
          methodCalled = true;
          return super.get(url, data, options);
        }
      })(),
      null,
      new DummyLinkGenerator(),
      [],
      []
    );

    await restClient.delete('foo', 1);
    expect(methodCalled).toBe(true);
  });

  it(
    'should allow classes extending the AbstractEntity class to be used ' +
      'as resource',
    async () => {
      let restClient = new DummyRestClient(
        new (class extends DummyHttpAgent {
          get(url, data, options) {
            expect(url).toBe('http://server.api/this-is-the-resource');

            return Promise.resolve({
              status: 200,
              body: [
                {
                  id: 1,
                  stuff: 'yes',
                },
                {
                  id: 2,
                  stuff: 'no',
                },
              ],
              params: {
                method: 'GET',
                url,
                transformedUrl: url,
                data,
                headers: options.headers,
              },
              headers: {},
              cached: false,
            });
          }
        })(),
        null,
        new DummyLinkGenerator(),
        [],
        []
      );

      class Entity extends AbstractEntity {
        static get resourceName() {
          return 'this-is-the-resource';
        }

        static get idFieldName() {
          return 'id';
        }
      }

      let response = await restClient.list(Entity);

      expect(response.request.resource).toBe(Entity);
      expect(response.body instanceof Array).toBeTruthy();
      expect(response.body).toEqual([
        new Entity({
          id: 1,
          stuff: 'yes',
        }),
        new Entity({
          id: 2,
          stuff: 'no',
        }),
      ]);
    }
  );

  it(
    'should handle single-entity response and empty response when using ' +
      'a class as resource',
    async () => {
      let responseBody = {
        id: 1,
        stuff: 'yes',
      };

      class Entity extends AbstractEntity {
        static get resourceName() {
          return 'this-is-the-resource';
        }

        static get idFieldName() {
          return 'id';
        }
      }

      let restClient = new DummyRestClient(
        new (class extends DummyHttpAgent {
          get(url, data, options) {
            return Promise.resolve({
              status: 200,
              body: responseBody,
              params: {
                method: 'GET',
                url,
                transformedUrl: url,
                data,
                headers: options.headers,
              },
              headers: {},
              cached: false,
            });
          }
        })(),
        null,
        new DummyLinkGenerator(),
        [],
        []
      );

      let parent = new Entity({
        id: 'nope',
      });

      let response = await restClient
        .list(Entity, {}, {}, parent)
        .then(response => {
          expect(response.request.resource).toBe(Entity);
          expect(response.body instanceof Entity).toBeTruthy();
          expect(response.body).toEqual(
            new Entity({
              id: 1,
              stuff: 'yes',
            })
          );
          expect(response.body.$parentEntity).toBe(parent);

          responseBody = '';

          return restClient.list(Entity);
        });

      expect(response.body).toBeNull();
    }
  );

  it(
    'should inline the response body if the inlineResponseBody flag is ' +
      'set',
    async () => {
      class Entity extends AbstractEntity {
        static get resourceName() {
          return 'this-is-the-resource';
        }

        static get idFieldName() {
          return 'id';
        }

        static get inlineResponseBody() {
          return true;
        }
      }

      let restClient = new DummyRestClient(
        new (class extends DummyHttpAgent {
          get(url, data, options) {
            return Promise.resolve({
              status: 200,
              body: {
                id: 1,
                stuff: 'yes',
              },
              params: {
                method: 'GET',
                url,
                transformedUrl: url,
                data,
                headers: options.headers,
              },
              headers: {},
              cached: false,
            });
          }
        })(),
        null,
        new DummyLinkGenerator(),
        [],
        []
      );

      let response = await restClient.list(Entity);

      expect(response instanceof Entity).toBeTruthy();
      expect(response).toEqual(
        new Entity({
          id: 1,
          stuff: 'yes',
        })
      );
    }
  );
});
