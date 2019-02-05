import PlatformJS from 'platform';
import using from './using.js';

var testedUserAgents = [
  {
    uaString:
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.85 Safari/537.36',
    expected: {
      description: 'Chrome 40.0.2214.85 on Windows 7 / Server 2008 R2 64-bit',
      layout: 'Blink',
      manufacturer: null,
      name: 'Chrome',
      prerelease: null,
      product: null,
      ua:
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.85 Safari/537.36',
      version: '40.0.2214.85',
      os: {
        architecture: 64,
        family: 'Windows 7 / Server 2008 R2',
        version: '7'
      }
    }
  },
  {
    uaString:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
    expected: {
      description: 'Safari 9.0.2 on OS X 10.11.2',
      layout: 'WebKit',
      manufacturer: null,
      name: 'Safari',
      prerelease: null,
      product: null,
      ua:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
      version: '9.0.2',
      os: {
        architecture: 32,
        family: 'OS X',
        version: '10.11.2'
      }
    }
  },
  {
    uaString:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:43.0) Gecko/20100101 Firefox/43.0',
    expected: {
      description: 'Firefox 43.0 on Ubuntu 64-bit',
      layout: 'Gecko',
      manufacturer: null,
      name: 'Firefox',
      prerelease: null,
      product: null,
      ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:43.0) Gecko/20100101 Firefox/43.0',
      version: '43.0',
      os: {
        architecture: 64,
        family: 'Ubuntu',
        version: null
      }
    }
  },
  {
    uaString: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
    expected: {
      description: 'IE 11.0 32-bit on Windows 7 / Server 2008 R2 64-bit',
      layout: 'Trident',
      manufacturer: null,
      name: 'IE',
      prerelease: null,
      product: null,
      ua: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
      version: '11.0',
      os: {
        architecture: 64,
        family: 'Windows 7 / Server 2008 R2',
        version: '7'
      }
    }
  },
  {
    uaString:
      'Mozilla/5.0 (iPad; CPU OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13C75 Safari/601.1',
    expected: {
      description: 'Safari 9.0 on Apple iPad (iOS 9.2)',
      layout: 'WebKit',
      manufacturer: 'Apple',
      name: 'Safari',
      prerelease: null,
      product: 'iPad',
      ua:
        'Mozilla/5.0 (iPad; CPU OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13C75 Safari/601.1',
      version: '9.0',
      os: {
        architecture: 32,
        family: 'iOS',
        version: '9.2'
      }
    }
  },
  {
    uaString:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240',
    expected: {
      description: 'Microsoft Edge 12.10240 on Windows 10 64-bit',
      layout: 'EdgeHTML',
      manufacturer: null,
      name: 'Microsoft Edge',
      prerelease: null,
      product: null,
      ua:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240',
      version: '12.10240',
      os: {
        architecture: 64,
        family: 'Windows',
        version: '10'
      }
    }
  },
  {
    uaString:
      'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
    expected: {
      description: 'IE 11.0 32-bit on Windows 8.1 64-bit',
      layout: 'Trident',
      manufacturer: null,
      name: 'IE',
      prerelease: null,
      product: null,
      ua: 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
      version: '11.0',
      os: {
        architecture: 64,
        family: 'Windows',
        version: '8.1'
      }
    }
  },
  {
    uaString:
      'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
    expected: {
      description: 'Android Browser 4.0 (like Safari 5.x) on LG (Android 4.0.3)',
      layout: 'WebKit',
      manufacturer: 'LG',
      name: 'Android Browser',
      prerelease: null,
      product: 'LG',
      ua:
        'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
      version: '4.0',
      os: {
        architecture: 32,
        family: 'Android',
        version: '4.0.3'
      }
    }
  },
  {
    uaString: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    expected: {
      description: 'Google Browser on Google bot 2.1',
      layout: null,
      manufacturer: 'Google',
      name: 'Google Browser',
      prerelease: null,
      product: 'Google bot 2.1',
      ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      version: null,
      os: {
        architecture: null,
        family: null,
        version: null
      }
    }
  },
  {
    uaString: 'Mozilla/5.0 (compatible; SeznamBot/3.2; +http://fulltext.sblog.cz/)',
    expected: {
      description: 'Mozilla/5.0 (compatible; SeznamBot/3.2; +http://fulltext.sblog.cz/)',
      layout: null,
      manufacturer: null,
      name: null,
      prerelease: null,
      product: null,
      ua: 'Mozilla/5.0 (compatible; SeznamBot/3.2; +http://fulltext.sblog.cz/)',
      version: null,
      os: {
        architecture: null,
        family: null,
        version: null
      }
    }
  },
  {
    uaString: 'Mozilla/5.0 (PlayStation 4 1.000) AppleWebKit/536.26 (KHTML, like Gecko)',
    expected: {
      description: 'PlayStation Browser (like Safari 6.x) on PlayStation 4 1.000',
      layout: 'NetFront',
      manufacturer: null,
      name: 'PlayStation Browser',
      prerelease: null,
      product: 'PlayStation 4 1.000',
      ua: 'Mozilla/5.0 (PlayStation 4 1.000) AppleWebKit/536.26 (KHTML, like Gecko)',
      version: null,
      os: {
        architecture: null,
        family: null,
        version: null
      }
    }
  }
];

describe('PlatformJS', () => {
  it('should be included', () => {
    expect(typeof PlatformJS === 'object').toEqual(true);
    expect(typeof PlatformJS.parse === 'function').toEqual(true);
  });

  it('should have parse method', () => {
    expect(typeof PlatformJS.parse === 'function').toEqual(true);
  });

  describe('parse method', () => {
    using(testedUserAgents, testValues => {
      it(
        'should return correct description for UserAgent string: ' + testValues.uaString,
        () => {
          var result = PlatformJS.parse(testValues.uaString);
          expect(result.description).toEqual(testValues.expected.description);
        }
      );
      it(
        'should return correct layout for UserAgent string: ' + testValues.uaString,
        () => {
          var result = PlatformJS.parse(testValues.uaString);
          expect(result.layout).toEqual(testValues.expected.layout);
        }
      );
      it(
        'should return correct name for UserAgent string: ' + testValues.uaString,
        () => {
          var result = PlatformJS.parse(testValues.uaString);
          expect(result.name).toEqual(testValues.expected.name);
        }
      );
      it('should return correct ua for UserAgent string: ' + testValues.uaString, () => {
        var result = PlatformJS.parse(testValues.uaString);
        expect(result.ua).toEqual(testValues.expected.ua);
      });
      it(
        'should return correct version for UserAgent string: ' + testValues.uaString,
        () => {
          var result = PlatformJS.parse(testValues.uaString);
          expect(result.version).toEqual(testValues.expected.version);
        }
      );
      it(
        'should return correct OS architecture for UserAgent string: ' +
          testValues.uaString,
        () => {
          var result = PlatformJS.parse(testValues.uaString);
          expect(result.os.architecture).toEqual(testValues.expected.os.architecture);
        }
      );
      it(
        'should return correct OS family for UserAgent string: ' + testValues.uaString,
        () => {
          var result = PlatformJS.parse(testValues.uaString);
          expect(result.os.family).toEqual(testValues.expected.os.family);
        }
      );
      it(
        'should return correct OS version for UserAgent string: ' + testValues.uaString,
        () => {
          var result = PlatformJS.parse(testValues.uaString);
          expect(result.os.version).toEqual(testValues.expected.os.version);
        }
      );
    });
  });
});
