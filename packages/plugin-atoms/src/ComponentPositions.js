import { UserAgent } from '@ima/plugin-useragent';

/**
 * A bounding client rectangle.
 *
 * @typedef {{
 *            top: number,
 *            left: number,
 *            width: number,
 *            height: number
 *          }} BoundingClientRect
 */

/**
 * Component positions helper.
 */
export default class ComponentPositions {
  static get $dependencies() {
    return ['$Window', UserAgent];
  }

  /**
   * Initializes the helper.
   *
   * @param {import('@ima/core').Window} window
   * @param {UserAgent} userAgent
   */
  constructor(window, userAgent) {
    /**
     * @type {import('@ima/core').Window}
     */
    this._window = window;

    /**
     * @type {UserAgent}
     */
    this._userAgent = userAgent;
  }

  /**
   * Convert string to number.
   *
   * @param {string} string
   * @returns {number}
   */
  convertToNumber(string) {
    let number = 0;

    try {
      number = parseInt(string, 10);
    } catch (e) {
      number = 0;
    }

    return number;
  }

  /**
   * Returns percent of visibility defined area in window viewport.
   *
   * @param {BoundingClientRect} elmRect
   * @returns {number} The percent of visibility.
   */
  getPercentOfVisibility(elmRect) {
    if (!elmRect) {
      throw new Error(
        `Element rect is required. Call getBoundingClientRect()` +
          ` method on element or give object with properties { top: number,` +
          ` left: number, width: number, height: number }.`
      );
    }

    if (!this._window.isClient()) {
      return 0;
    }

    let windowViewportRect = this.getWindowViewportRect();

    let intersectionRect = this.getRectsIntersection(
      windowViewportRect,
      elmRect
    );
    let percent =
      ((intersectionRect.width * intersectionRect.height) /
        (elmRect.width * elmRect.height)) *
      100;

    return isNaN(percent) ? 0 : percent;
  }

  /**
   * Returns an intersection rectangle of two defined reactangles.
   *
   * @param {BoundingClientRect} rect1
   * @param {BoundingClientRect} rect2
   * @returns {BoundingClientRect} The intersection rectangle.
   */
  getRectsIntersection(rect1, rect2) {
    let top = this.getNumberFromRange(rect2.top, rect1.top, rect1.height);
    let left = this.getNumberFromRange(rect2.left, rect1.left, rect1.width);
    let bottom = this.getNumberFromRange(
      rect2.top + rect2.height,
      rect1.top,
      rect1.height
    );
    let right = this.getNumberFromRange(
      rect2.left + rect2.width,
      rect1.left,
      rect1.width
    );
    let width = right - left;
    let height = bottom - top;

    return { top, left, width, height };
  }

  /**
   * Returns number from defined range, if number is not in defined range return
   * min or max depends on number.
   *
   * @param {number} number
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  getNumberFromRange(number, min, max) {
    return Math.min(Math.max(number, min), max);
  }

  /**
   * Returns window viewport rect.
   *
   * @returns {BoundingClientRect}
   */
  getWindowViewportRect() {
    let win = this._window.getWindow();
    let top = 0;
    let left = 0;
    let width = 0;
    let height = 0;

    if (this._window.isClient()) {
      width = win.innerWidth;
      height = win.innerHeight;
    }

    return { top, left, width, height };
  }

  /**
   * Returns window scroll position.
   *
   * @returns {{top: number, left: number}}
   */
  getWindowScrollPosition() {
    let left = window.pageXOffset ? window.pageXOffset : 0;
    let top = window.pageYOffset ? window.pageYOffset : 0;

    return { top, left };
  }

  /**
   * Returns the size of an element and its position relative to the viewport
   * and add extended value to returned rect.
   *
   * @param {Element} element
   * @param {{width: number, height: number}} size
   * @param {number} extended
   * @returns {BoundingClientRect}
   */
  getBoundingClientRect(
    element,
    { width, height } = { width: 0, height: 0 },
    extended = 0
  ) {
    if (!element || typeof element.getBoundingClientRect !== 'function') {
      throw new Error(
        `Element rect is required with callable getBoundingClientRect()` +
          ` method on element.`
      );
    }

    const clientRect = element.getBoundingClientRect();
    const isInvisibleElement =
      clientRect.top === 0 &&
      clientRect.left === 0 &&
      clientRect.width === 0 &&
      clientRect.height === 0;

    if (isInvisibleElement) {
      const { top, left, width, height } = clientRect;

      return { top, left, width, height };
    }

    let elmRectStyle = {
      top: clientRect.top - extended,
      left: clientRect.left - extended,
      width: clientRect.width + 2 * extended,
      height: (clientRect.height || height || 0 / width || 0) + 2 * extended,
    };

    return this._fixBoundingClientRectOnIOS(elmRectStyle);
  }

  /**
   * Applies a fix for iOS 8+ bug, where overscroll messes up
   * getBoundingClientRect()'s top value on all iOS webkit based devices:
   * https://github.com/lionheart/openradar-mirror/issues/6233
   *
   * @param {BoundingClientRect} boundingClientRect A bounding client rectangle.
   * @returns {BoundingClientRect} A fixed bounding client rectangle.
   */
  _fixBoundingClientRectOnIOS(boundingClientRect) {
    if (this._userAgent.getOSFamily() !== 'iOS') {
      return boundingClientRect;
    }

    const window = this._window.getWindow();
    const maxScrollHeight = this._getMaxScrollHeight();
    const rect = Object.assign({}, boundingClientRect);

    if (window.scrollY < 0 && rect.top > 0) {
      rect.top += window.scrollY;
    } else if (window.scrollY > maxScrollHeight && rect.top < 0) {
      rect.top += window.scrollY - maxScrollHeight;
    }

    return rect;
  }

  /**
   * Returns maximum available scroll height (minus viewport height).
   *
   * @returns {number}
   */
  _getMaxScrollHeight() {
    const window = this._window.getWindow();
    const document = this._window.getDocument();

    return (
      Math.max(
        document.body.scrollHeight || 0,
        document.body.offsetHeight || 0,
        document.documentElement.clientHeight || 0,
        document.documentElement.offsetHeight || 0,
        document.documentElement.scrollHeight || 0
      ) - window.innerHeight
    );
  }
}
