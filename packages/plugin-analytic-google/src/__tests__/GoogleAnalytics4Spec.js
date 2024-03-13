import { Dispatcher, Window } from '@ima/core';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';
import { toMockedInstance } from 'to-mock';

import GoogleAnalytics4 from '../GoogleAnalytics4';

describe('GoogleAnalytics4', () => {
  const settings = {
    service: 'G-XXXXXXXXXX',
    consentSettings: {},
  };

  let mockDocument;

  function setMockDocument(document = {}) {
    mockDocument = { ...document };
    global.document = mockDocument;
  }

  const mockWindow = {
    gtag: jest.fn(),
  };
  const mockUrl = 'mockUrl';

  const scriptLoader = toMockedInstance(ScriptLoaderPlugin);
  const dispatcher = toMockedInstance(Dispatcher);

  let googleAnalytics4 = null;

  beforeEach(() => {
    setMockDocument();
    const window = toMockedInstance(Window, {
      getDocument() {
        return mockDocument;
      },
      getWindow() {
        return mockWindow;
      },
      getUrl() {
        return mockUrl;
      },
    });

    googleAnalytics4 = new GoogleAnalytics4(
      scriptLoader,
      window,
      dispatcher,
      settings
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('method', () => {
    describe('hitPageView', () => {
      it('should call event page_view on gtag', () => {
        jest.spyOn(googleAnalytics4, 'isEnabled').mockReturnValue(true);

        const pageTitle = 'Page title';
        const mockPath = 'somePath';
        const mockReferrer = 'https://google.com';

        setMockDocument({
          title: pageTitle,
          referrer: mockReferrer,
        });

        googleAnalytics4.hitPageView({
          path: mockPath,
          response: { status: 200 },
          route: { getName: () => 'someRoute' },
        });

        expect(mockWindow.gtag).toHaveBeenCalledWith('event', 'page_view', {
          page_location: mockUrl,
          page_path: mockPath,
          page_title: pageTitle,
          page_referrer: mockReferrer,
          page_route: 'someRoute',
          page_status: 200,
        });
      });
    });

    describe('hit', () => {
      it('should hit given custom event', () => {
        jest.spyOn(googleAnalytics4, 'isEnabled').mockReturnValue(true);

        const customEventName = 'customEventName';
        const customEventData = {
          property1: 'value1',
          property2: 2,
        };

        googleAnalytics4.hit(customEventName, customEventData);

        expect(mockWindow.gtag).toHaveBeenCalledWith(
          'event',
          customEventName,
          customEventData
        );
      });
    });

    describe('_applyPurposeConsents', () => {
      it('should set consent setting analytics_storage to granted when purpose 1 is set', () => {
        googleAnalytics4._applyPurposeConsents({ 1: true });

        expect(googleAnalytics4._consentSettings.analytics_storage).toBe(
          'granted'
        );
      });

      it('should set consent setting analytics_storage to denied when purpose 1 is not set', () => {
        googleAnalytics4._applyPurposeConsents({ 1: false });

        expect(googleAnalytics4._consentSettings.analytics_storage).toBe(
          'denied'
        );
      });

      it('should set consent setting analytics_storage to denied when purpose 1 is not present', () => {
        googleAnalytics4._applyPurposeConsents({});

        expect(googleAnalytics4._consentSettings.analytics_storage).toBe(
          'denied'
        );
      });
    });

    describe('updateConsent', () => {
      it('should apply new consent and fire consent update event', () => {
        const purposeConsents = {
          1: true,
        };

        googleAnalytics4.updateConsent(purposeConsents);

        expect(mockWindow.gtag).toHaveBeenCalledWith(
          'consent',
          'update',
          expect.any(Object)
        );
      });
    });
  });
});
