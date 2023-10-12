import classnames from 'classnames';
import { Infinite } from 'infinite-circle';
import { toMockedInstance } from 'to-mock';

import _router from './mocks/router';
import _window from './mocks/window';
import ComponentPositions from '../ComponentPositions';
import UIComponentHelper from '../UIComponentHelper';
import Visibility from '../Visibility';

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

  describe('serializeObjectToNoScript method', () => {
    let ariaProps = {
      'aria-label': 'something',
      'aria-hidden': true,
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
            'more-things': true,
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
        isIntersecting: true,
      },
    };
    const NONINTERSECTED_PAYLOAD_OBJECT = {
      observer: OBSERVER,
      intersectionObserverEntry: {
        intersectionRatio: 0,
        isIntersecting: false,
      },
    };
    const BUGGED_PAYLOAD_OBJECT = {
      observer: OBSERVER,
      intersectionObserverEntry: {
        intersectionRatio: 0,
        isIntersecting: true,
      },
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
