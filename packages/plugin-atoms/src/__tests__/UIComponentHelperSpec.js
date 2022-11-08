import { toMockedInstance } from 'to-mock';
import classnames from 'classnames';

import ComponentPositions from '../ComponentPositions';
import UIComponentHelper from '../UIComponentHelper';
import Visibility from '../Visibility';
import { Infinite } from 'infinite-circle';

import _router from './mocks/router';
import _window from './mocks/window';

describe('UIComponentHelper', () => {
  let uiComponentHelper = null;
  let visibility = toMockedInstance(Visibility);
  let componentPositions = toMockedInstance(ComponentPositions);
  let infinite = toMockedInstance(Infinite);

  beforeEach(() => {
    uiComponentHelper = new UIComponentHelper(
      _router,
      _window,
      componentPositions,
      visibility,
      infinite,
      classnames
    );
  });

  describe('isAmp method', () => {
    it('should return true if url query contains amp flag of value true', () => {
      jest.spyOn(_router, 'getCurrentRouteInfo').mockReturnValue({
        params: { amp: true }
      });

      expect(uiComponentHelper.isAmp()).toBeTruthy();
    });

    it('should return true if url query contains amp flag of value "1"', () => {
      jest.spyOn(_router, 'getCurrentRouteInfo').mockReturnValue({
        params: { amp: '1' }
      });

      expect(uiComponentHelper.isAmp()).toBeTruthy();
    });

    it('should return false if url query does not contain amp flag', () => {
      jest.spyOn(_router, 'getCurrentRouteInfo').mockReturnValue({
        params: { amp: '0' }
      });

      expect(uiComponentHelper.isAmp()).toBeFalsy();
    });

    it('should return false if url query not contains amp flag', () => {
      expect(uiComponentHelper.isAmp()).toBeFalsy();
    });
  });

  describe('getDataProps method', () => {
    let dataProps = {
      'data-e2e': 'something',
      'data-key': 'key'
    };
    let props = Object.assign({ key: 'key' }, dataProps);

    it('should return only attributes with name data-*', () => {
      expect(uiComponentHelper.getDataProps(props)).toEqual(dataProps);
    });
  });

  describe('getAriaProps method', () => {
    let ariaProps = {
      'aria-label': 'something',
      'aria-hidden': true
    };
    let props = Object.assign({ key: 'key' }, ariaProps);

    it('should return only attributes with name aria-*', () => {
      expect(uiComponentHelper.getAriaProps(props)).toEqual(ariaProps);
    });
  });

  describe('getEventProps method', () => {
    let eventProps = {
      onKeyDown: () => {},
      onClick: function () {}
    };
    let props = Object.assign(
      {
        key: 'key',
        once: 'notValid',
        oNsubmit: 'notValid',
        onSubmit: 'notValid',
        onDrag: {}
      },
      eventProps
    );

    it('should return only attributes with name on[A-Z]*', () => {
      expect(uiComponentHelper.getEventProps(props)).toEqual(eventProps);
    });
  });

  describe('serializeObjectToNoScript method', () => {
    let ariaProps = {
      'aria-label': 'something',
      'aria-hidden': true
    };

    it('should return serialized object to string for noscript tag', () => {
      expect(
        uiComponentHelper.serializeObjectToNoScript(ariaProps)
      ).toMatchSnapshot();
    });
  });

  describe('cssClasses method', () => {
    it('should compose CSS class names', () => {
      expect(
        uiComponentHelper.cssClasses(
          'stuff another-foo',
          {
            foo: true,
            bar: false,
            another: false,
            'more-things': true
          },
          'things'
        )
      ).toBe('stuff another-foo foo more-things things');
    });
  });

  describe('getVisibilityReader method', () => {
    it('return base visibility reader function', () => {
      expect(
        typeof uiComponentHelper.getVisibilityReader({}, {}) === 'function'
      ).toBeTruthy();
    });
  });

  describe('wrapVisibilityWriter method', () => {
    function writer(...args) {
      return `writer value: ${args.join(',')}`;
    }

    function wrapWriterTest(payload) {
      const entry = { payload };
      const parse = uiComponentHelper.wrapVisibilityWriter(writer);

      return parse(entry);
    }

    const OBSERVER = {};
    const PAYLOAD = 42;
    const PAYLOAD_OBJECT = {
      observer: OBSERVER,
      intersectionObserverEntry: {
        intersectionRatio: 0.3,
        isIntersecting: true
      }
    };
    const NONINTERSECTED_PAYLOAD_OBJECT = {
      observer: OBSERVER,
      intersectionObserverEntry: {
        intersectionRatio: 0,
        isIntersecting: false
      }
    };
    const BUGGED_PAYLOAD_OBJECT = {
      observer: OBSERVER,
      intersectionObserverEntry: {
        intersectionRatio: 0,
        isIntersecting: true
      }
    };

    it('should return a return value of writer(PAYLOAD)', () => {
      const result = wrapWriterTest(PAYLOAD);
      expect(result).toBe(writer(PAYLOAD));
    });

    it('should return a return value of writer(30, OBSERVER)', () => {
      const result = wrapWriterTest(PAYLOAD_OBJECT);
      expect(result).toBe(writer(30, OBSERVER));
    });

    it('should return a return value of writer(0, OBSERVER)', () => {
      const result = wrapWriterTest(NONINTERSECTED_PAYLOAD_OBJECT);
      expect(result).toBe(writer(0, OBSERVER));
    });

    it('should return a return value of writer(100, OBSERVER)', () => {
      const result = wrapWriterTest(BUGGED_PAYLOAD_OBJECT);
      expect(result).toBe(writer(100, OBSERVER));
    });
  });
});
