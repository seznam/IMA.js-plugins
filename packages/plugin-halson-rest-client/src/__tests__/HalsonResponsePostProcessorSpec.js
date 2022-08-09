import AbstractHalsonEntity from '../AbstractHalsonEntity';
import HalsonResponsePostProcessor from '../HalsonResponsePostProcessor';
import { Request, Response } from '@ima/plugin-rest-client';

describe('HalsonResponsePostProcessor', () => {
  let postProcessor;
  let response;
  let responseBody;
  let embeds;

  beforeEach(() => {
    postProcessor = new HalsonResponsePostProcessor();
    responseBody = null;
    embeds = null;
    constructResponse();
  });

  it('should handle empty response body', () => {
    let processed = postProcessor.process(response).body;
    expect(processed).toBeNull();
  });

  it('should handle single entity', () => {
    responseBody = {
      foo: 'bar',
      baz: 123,
      _links: {
        self: '/foo/123'
      }
    };
    constructResponse();
    let processed = postProcessor.process(response).body;
    expect(Object.assign({}, processed)).toEqual({
      foo: 'bar',
      baz: 123,
      _links: {
        self: '/foo/123'
      }
    });
  });

  it('should inline embeds of a single entity', () => {
    responseBody = {
      foo: 'bar',
      _embedded: {
        'prefixed:stuff': {
          data: 12
        },
        nonPrefixed: {
          data: 34
        },
        'a:lot:of:prefixes:stuff2': {
          data: 56
        },
        ignored: {
          data: 78
        }
      }
    };
    embeds = ['prefixed:stuff', 'nonPrefixed', 'a:lot:of:prefixes:stuff2'];
    constructResponse();
    let processed = postProcessor.process(response).body;
    expect(deepCopy(processed)).toEqual({
      foo: 'bar',
      stuff: {
        data: 12
      },
      nonPrefixed: {
        data: 34
      },
      stuff2: {
        data: 56
      },
      _embedded: {
        'prefixed:stuff': {
          data: 12
        },
        nonPrefixed: {
          data: 34
        },
        'a:lot:of:prefixes:stuff2': {
          data: 56
        },
        ignored: {
          data: 78
        }
      }
    });
  });

  it('should handle an inlined list of entities', () => {
    responseBody = [
      {
        foo: 'bar'
      },
      {
        bar: 'baz'
      }
    ];
    constructResponse();
    let processed = postProcessor.process(response).body;
    expect(deepCopy(processed)).toEqual([
      {
        foo: 'bar'
      },
      {
        bar: 'baz'
      }
    ]);
  });

  it('should handle a single embedded entity as list', () => {
    responseBody = {
      _embedded: {
        foo: {
          bar: 'baz'
        }
      }
    };
    constructResponse();
    let processed = postProcessor.process(response).body;
    expect(deepCopy(processed)).toEqual([
      {
        bar: 'baz'
      }
    ]);
  });

  it('should handle a list of embedded entities', () => {
    responseBody = {
      _embedded: {
        foo: [
          {
            id: 1
          },
          {
            id: 2
          }
        ]
      }
    };
    constructResponse();
    let processed = postProcessor.process(response).body;
    expect(deepCopy(processed)).toEqual([
      {
        id: 1
      },
      {
        id: 2
      }
    ]);
  });

  it('should inline embeds of a list of entities', () => {
    responseBody = [
      {
        id: 1,
        _embedded: {
          'prefix:foo': {
            data: 123
          },
          ignored: {
            data: 456
          }
        }
      },
      {
        id: 2,
        _embedded: {
          'prefix:foo': {
            moreData: 789
          },
          anotherIgnored: {
            data: 987
          }
        }
      }
    ];
    embeds = ['prefix:foo'];
    constructResponse();
    let processed = postProcessor.process(response).body;
    expect(deepCopy(processed)).toEqual([
      {
        id: 1,
        foo: {
          data: 123
        },
        _embedded: {
          'prefix:foo': {
            data: 123
          },
          ignored: {
            data: 456
          }
        }
      },
      {
        id: 2,
        foo: {
          moreData: 789
        },
        _embedded: {
          'prefix:foo': {
            moreData: 789
          },
          anotherIgnored: {
            data: 987
          }
        }
      }
    ]);
  });

  class Entity extends AbstractHalsonEntity {
    static get resourceName() {
      return 'foos';
    }

    static get idFieldName() {
      return '_id';
    }

    static get embedName() {
      return 'foo';
    }

    static get idParameterName() {
      return 'id';
    }

    static get inlineEmbeds() {
      return embeds;
    }
  }

  /**
   *
   */
  function constructResponse() {
    response = new Response({
      status: 200,
      headers: {},
      body: responseBody,
      cached: true,
      request: new Request({
        parentEntity: null,
        resource: Entity,
        parameters: null,
        method: 'GET',
        url: 'http://localhost/api/foo',
        data: null,
        headers: {},
        options: {},
        serverConfiguration: null
      })
    });
  }

  /**
   *
   * @param {object} source
   * @returns {object}
   */
  function deepCopy(source) {
    if (source instanceof Array) {
      return source.map(entity => deepCopy(entity));
    }

    let copy = {};
    for (let field in source) {
      if (!Object.hasOwnProperty.call(source, field)) {
        continue;
      }

      if (source[field] instanceof Object) {
        copy[field] = deepCopy(source[field]);
      } else {
        copy[field] = source[field];
      }
    }
    return copy;
  }
});
