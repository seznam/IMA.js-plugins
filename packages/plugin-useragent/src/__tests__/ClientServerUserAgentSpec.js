import using from './using.js';
import ClientUserAgent from '../ClientUserAgent';
import ServerUserAgent from '../ServerUserAgent';

describe('Client/Server implementation of Abstract class', () => {
  var userAgentString =
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.85 Safari/537.36';

  var userAgentObject = {
    description: 'Chrome 40.0.2214.85 on Windows Server 2008 R2 / 7 64-bit',
    layout: 'Blink',
    manufacturer: null,
    name: 'Chrome',
    prerelease: null,
    product: null,
    ua: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.85 Safari/537.36',
    version: '40.0.2214.85',
    os: {
      architecture: 64,
      family: 'Windows Server 2008 R2 / 7',
      version: '7',
    },
  };

  var userAgentObjectImproved = {
    description: 'Chrome 40.0.2214.85 on Windows Server 2008 R2 / 7 64-bit',
    layout: 'Blink',
    manufacturer: 'unknown',
    name: 'Chrome',
    prerelease: 'unknown',
    product: 'unknown',
    ua: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.85 Safari/537.36',
    version: '40.0.2214.85',
    os: {
      architecture: 64,
      family: 'Windows Server 2008 R2 / 7',
      version: '7',
    },
  };

  var userAgentObjectUndefined = {
    name: undefined,
    ua: undefined,
    version: undefined,
    os: {
      architecture: undefined,
      family: undefined,
      version: undefined,
    },
  };

  var userAgentObjectNull = {
    description: null,
    layout: null,
    manufacturer: null,
    prerelease: null,
    product: null,
    name: null,
    ua: null,
    version: null,
    os: null,
  };
  var userAgentObjectUnknown = {
    description: 'unknown',
    layout: 'unknown',
    manufacturer: 'unknown',
    prerelease: 'unknown',
    product: 'unknown',
    name: 'unknown',
    ua: 'unknown',
    version: 'unknown',
    os: {
      architecture: -1,
      family: 'unknown',
      version: 'unknown',
    },
  };

  /**
   * Generates user agent implementation mocks
   *
   * @param {object} platformJS
   * @returns {object[]}
   */
  function getImplementations(platformJS) {
    var $WindowMock = {
      getWindow: () => {
        return {
          navigator: {
            userAgent: userAgentString,
          },
        };
      },
    };

    var $RequestMock = {
      getHeader: key => {
        if (key === 'User-Agent') {
          return userAgentString;
        } else {
          return null;
        }
      },
    };

    var PlatformJSMock = platformJS;
    if (!platformJS) {
      PlatformJSMock = {
        parse: () => userAgentObject,
      };
    }

    var uaClient = new ClientUserAgent(PlatformJSMock, $WindowMock);
    var uaServer = new ServerUserAgent(PlatformJSMock, $RequestMock);

    uaClient.init();
    uaServer.init();

    return [
      { instance: uaClient, name: 'client' },
      { instance: uaServer, name: 'server' },
    ];
  }

  describe('getPlatform method', () => {
    using(getImplementations(), implementation => {
      it(
        'should return correct user-agent object on ' + implementation.name,
        () => {
          expect(implementation.instance.getPlatform()).toEqual(
            userAgentObjectImproved
          );
        }
      );
    });

    var PlatformJSMockUndefined = {
      parse: () => userAgentObjectUndefined,
    };
    using(getImplementations(PlatformJSMockUndefined), implementation => {
      it(
        'should return correct user-agent object on undefined values on ' +
          implementation.name,
        () => {
          expect(implementation.instance.getPlatform()).toEqual(
            userAgentObjectUnknown
          );
        }
      );
    });

    var PlatformJSMockNull = {
      parse: () => userAgentObjectNull,
    };
    using(getImplementations(PlatformJSMockNull), implementation => {
      it(
        'should return correct user-agent object on null values on ' +
          implementation.name,
        () => {
          expect(implementation.instance.getPlatform()).toEqual(
            userAgentObjectUnknown
          );
        }
      );
    });
  });

  describe('getUserAgent method', () => {
    using(getImplementations(), implementation => {
      it(
        'should return correct user-agent string on ' + implementation.name,
        () => {
          expect(implementation.instance.getUserAgent()).toEqual(
            userAgentString
          );
        }
      );
    });
  });

  describe('getDescription method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getDescription()).toEqual(
          userAgentObject.description
        );
      });
    });
  });

  describe('getLayout method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getLayout()).toEqual(
          userAgentObject.layout
        );
      });
    });
  });

  describe('getManufacturer method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getManufacturer()).toBe('unknown');
      });
    });
  });

  describe('getName method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getName()).toEqual(userAgentObject.name);
      });
    });
  });

  describe('getPrerelease method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getPrerelease()).toBe('unknown');
      });
    });
  });

  describe('getProduct method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getProduct()).toBe('unknown');
      });
    });
  });

  describe('getVersion method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getVersion()).toEqual(
          userAgentObject.version
        );
      });
    });
  });

  describe('getOSFamily method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getOSFamily()).toEqual(
          userAgentObject.os.family
        );
      });
    });
  });

  describe('getOSArchitecture method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getOSArchitecture()).toEqual(
          userAgentObject.os.architecture
        );
      });
    });
  });

  describe('getOSVersion method', () => {
    using(getImplementations(), implementation => {
      it('should return correct string on ' + implementation.name, () => {
        expect(implementation.instance.getOSVersion()).toEqual(
          userAgentObject.os.version
        );
      });
    });
  });
});
