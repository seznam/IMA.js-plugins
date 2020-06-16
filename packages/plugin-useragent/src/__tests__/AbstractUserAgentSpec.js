import PlatformJS from 'platform';
import using from './using.js';
import AbstractUserAgent from '../AbstractUserAgent';

var testedUserAgents = [
  {
    uaString:
      'Mozilla/5.0 (Linux; Android 8.0.0; SM-G950F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.99 Mobile Safari/537.36 SznProhlizec/7.1.1a',
    expected: {
      name: 'SznProhlizec',
      version: '7.1'
    }
  },
  {
    uaString:
      'Mozilla/5.0 (Linux; Android 9; AOSP on IA Emulator Build/PSR1.180720.117) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36 SznProhlizec/7.1.1a',
    expected: {
      name: 'SznProhlizec',
      version: '7.1'
    }
  },
  {
    uaString:
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 SznProhlizec/6.2.1',
    expected: {
      name: 'SznProhlizec',
      version: '6.2'
    }
  },
  {
    uaString:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9 SznProhlizec/7.4i',
    expected: {
      name: 'SznProhlizec',
      version: '7.4'
    }
  },
  {
    uaString:
      'Mozilla/5.0 (iPad; CPU OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 Tablet SznProhlizec/7.4',
    expected: {
      name: 'SznProhlizec',
      version: '7.4'
    }
  },
  {
    uaString:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 SznProhlizec/7.4i',
    expected: {
      name: 'SznProhlizec',
      version: '7.4'
    }
  },
  {
    uaString:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/605.1.15 SznProhlizec/7.3i',
    expected: {
      name: 'SznProhlizec',
      version: '7.3'
    }
  },
  {
    uaString:
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 SznProhlizec/6.2.1-1112171',
    expected: {
      name: 'SznProhlizec',
      version: '6.2'
    }
  }
];

describe('AbstractUserAgent', () => {
  using(testedUserAgents, (testValues) => {
    let abstractUserAgent = null;

    beforeEach(() => {
      abstractUserAgent = new AbstractUserAgent(PlatformJS);

      spyOn(abstractUserAgent, 'getUserAgent').and.returnValue(
        testValues.uaString
      );

      abstractUserAgent.init();
    });

    it(
      'should return correct name for UserAgent string: ' + testValues.uaString,
      () => {
        var result = abstractUserAgent.getName();

        expect(result).toEqual(testValues.expected.name);
      }
    );
    it(
      'should return correct version for UserAgent string: ' +
        testValues.uaString,
      () => {
        var result = abstractUserAgent.getVersion();

        expect(result).toEqual(testValues.expected.version);
      }
    );
  });
});
