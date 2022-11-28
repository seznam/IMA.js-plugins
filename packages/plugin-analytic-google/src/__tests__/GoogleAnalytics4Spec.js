import { toMockedInstance } from 'to-mock';

import { Dispatcher, Window } from '@ima/core';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';

import GoogleAnalytics4 from '../GoogleAnalytics4';

describe('GoogleAnalytics4', () => {
  const settings = {
    service: 'G-XXXXXXXXXX',
    consentSettings: {}
  };

  const mockGtag = {
    gtag() {}
  };
  const mockUrl = 'mockUrl';

  const scriptLoader = toMockedInstance(ScriptLoaderPlugin);
  const dispatcher = toMockedInstance(Dispatcher);
  const window = toMockedInstance(Window, {
    getWindow() {
      return mockGtag;
    },
    getUrl() {
      return mockUrl;
    }
  });
  let googleAnalytics4 = null;

  beforeEach(() => {
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
        jest.spyOn(mockGtag, 'gtag');

        const pageTitle = 'Page title';
        const mockPath = 'somePath';

        global.document = {
          title: pageTitle
        };

        googleAnalytics4.hitPageView({ path: mockPath });

        expect(mockGtag.gtag).toHaveBeenCalledWith('event', 'page_view', {
          location: mockUrl,
          page: mockPath,
          title: pageTitle
        });
      });
    });

    describe('_applyPurposeConsents', () => {
      it('should set consent setting analytics_storage to granted when purpose 1 is set', () => {
        googleAnalytics4._applyPurposeConsents({ 1: true });

        expect(googleAnalytics4._consentSettings.analytics_storage).toEqual(
          'granted'
        );
      });

      it('should set consent setting analytics_storage to denied when purpose 1 is not set', () => {
        googleAnalytics4._applyPurposeConsents({ 1: false });

        expect(googleAnalytics4._consentSettings.analytics_storage).toEqual(
          'denied'
        );
      });

      it('should set consent setting analytics_storage to denied when purpose 1 is not present', () => {
        googleAnalytics4._applyPurposeConsents({});

        expect(googleAnalytics4._consentSettings.analytics_storage).toEqual(
          'denied'
        );
      });
    });

    describe('updateConsent', () => {
      it('should apply new consent and fire consent update event', () => {
        const purposeConsents = {
          1: true
        };

        googleAnalytics4.updateConsent(purposeConsents);

        expect(mockGtag.gtag).toHaveBeenCalledWith(
          'consent',
          'update',
          expect.any(Object)
        );
      });
    });
  });
});
