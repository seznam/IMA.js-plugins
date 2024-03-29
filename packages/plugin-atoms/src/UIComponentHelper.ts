import type { Router, Window, Dependencies } from '@ima/core';
// @ts-expect-error
import { Infinite } from 'infinite-circle';

import ComponentPositions from './ComponentPositions';
import Visibility from './Visibility';

export type VisibilityOptions = {
  width?: number;
  height?: number;
  extendedPadding?: number;
  useIntersectionObserver: boolean;
  threshold?: number[];
};

/**
 * UI component helper.
 */
export default class UIComponentHelper {
  static $dependencies: Dependencies = [
    '$Router',
    '$Window',
    ComponentPositions,
    Visibility,
    Infinite,
    '$CssClasses',
  ];

  private _router: Router;
  private _window: Window;
  readonly componentPositions: ComponentPositions;
  readonly visibility: Visibility;
  readonly infinite: Infinite;
  private _cssClassNameProcessor: (...args: any[]) => string; // TODO

  /**
   * Initializes the helper.
   * @param router
   * @param window
   * @param componentPositions
   * @param visibility
   * @param infinite
   * @param cssClassNameProcessor
   */
  constructor(
    router: Router,
    window: Window,
    componentPositions: ComponentPositions,
    visibility: Visibility,
    infinite: Infinite,
    cssClassNameProcessor: (...args: any[]) => string // TODO
  ) {
    this._router = router;
    this._window = window;
    this.componentPositions = componentPositions;
    this.visibility = visibility;
    this.infinite = infinite;
    this._cssClassNameProcessor = cssClassNameProcessor;
  }

  /**
   * The public method which registers visibility circle to inifinite loop.
   */
  init() {
    this.infinite.add(this.visibility.circle);
  }

  /**
   * The regular expression was taken from the Closure sanitization library.
   * @param url
   */
  sanitizeUrl(url: string) {
    const SAFE_URL_PATTERN =
      /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;

    url = String(url).trim();
    if (url.match(SAFE_URL_PATTERN)) return url;

    return 'unsafe:' + url;
  }

  /**
   * Serialize object as key and value pairs for using in noscript tag.
   * @param object
   */
  serializeObjectToNoScript(object: Record<string, any>) {
    return Object.keys(object).reduce((string, key) => {
      return string + ` ${key?.toLowerCase?.()}="${object[key]}"`;
    }, '');
  }

  /**
   * Generate a string of CSS classes from the properties of the passed-in
   * object that resolve to true.
   * @param {...any} classRuleGroups
   */
  cssClasses(...classRuleGroups: (string | Record<string, boolean>)[]) {
    return this._cssClassNameProcessor(...classRuleGroups);
  }

  getVisibilityReader(element: HTMLElement, options: VisibilityOptions) {
    if (
      options.useIntersectionObserver &&
      // @ts-expect-error
      this._window.getWindow()?.IntersectionObserver
    ) {
      return this._getObserableReader(element, options);
    } else {
      return this._getReader(element, options);
    }
  }

  private _getReader(element: HTMLElement, options: VisibilityOptions) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return function readVisibility() {
      const elementRect = self.componentPositions.getBoundingClientRect(
        element,
        { width: options.width, height: options.height },
        options.extendedPadding
      );

      return self.componentPositions.getPercentOfVisibility(elementRect);
    };
  }

  private _getObserableReader(
    element: HTMLElement,
    options: VisibilityOptions
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const observerConfig = {
      rootMargin: options.extendedPadding + 'px',
      threshold: options.threshold || [0],
    };
    let intersectionObserverEntry: IntersectionObserverEntry | null = null;
    let isFirstPositionCalculated = false;

    const observer = new IntersectionObserver(entries => {
      intersectionObserverEntry = entries[0]!;
      this.visibility.circle.notify({ type: 'intersectionobserver', entries });
    }, observerConfig);
    observer.observe(element);

    return function readVisibility() {
      if (!isFirstPositionCalculated) {
        isFirstPositionCalculated = true;
        return { visibility: self._getReader(element, options)(), observer };
      }

      return { intersectionObserverEntry, observer };
    };
  }

  wrapVisibilityWriter(writer: (arg0: number, arg1?: any) => any) {
    return function parsePayload(circleEntry: any) {
      const { payload } = circleEntry;

      if (
        typeof payload === 'object' &&
        payload.observer &&
        payload.intersectionObserverEntry
      ) {
        const { intersectionObserverEntry: entry, observer } = payload;
        const isIntersectionBugged =
          entry.intersectionRatio === 0 && entry.isIntersecting;

        return writer(
          !isIntersectionBugged ? entry.intersectionRatio * 100 : 100,
          observer
        );
      } else if (
        typeof payload === 'object' &&
        payload.observer &&
        payload.visibility
      ) {
        return writer(payload.visibility, payload.observer);
      } else {
        return writer(payload);
      }
    };
  }
}
