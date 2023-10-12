/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { ClientWindow, Dependencies } from '@ima/core';

export type VisibilityRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

/**
 * Component positions helper.
 */
export default class ComponentPositions {
  static $dependencies: Dependencies = ['$Window'];

  private _window: ClientWindow;

  /**
   * Initializes the helper.
   */
  constructor(window: ClientWindow) {
    this._window = window;
  }

  /**
   * Convert string to number.
   */
  convertToNumber(string: string) {
    try {
      return parseInt(string, 10);
    } catch (_) {
      /* empty */
    }

    return 0;
  }

  /**
   * Returns percent of visibility defined area in window viewport.
   */
  getPercentOfVisibility(elmRect: VisibilityRect) {
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

    const intersectionRect = this.getRectsIntersection(
      this.getWindowViewportRect(),
      elmRect
    );

    return (
      ((intersectionRect.width * intersectionRect.height) /
        (elmRect.width * elmRect.height)) *
        100 || 0
    );
  }

  /**
   * Returns an intersection rectangle of two defined reactangles.
   */
  getRectsIntersection(
    rect1: VisibilityRect,
    rect2: VisibilityRect
  ): VisibilityRect {
    const top = this.getNumberFromRange(rect2.top, rect1.top, rect1.height);
    const left = this.getNumberFromRange(rect2.left, rect1.left, rect1.width);
    const bottom = this.getNumberFromRange(
      rect2.top + rect2.height,
      rect1.top,
      rect1.height
    );
    const right = this.getNumberFromRange(
      rect2.left + rect2.width,
      rect1.left,
      rect1.width
    );
    const width = right - left;
    const height = bottom - top;

    return { top, left, width, height };
  }

  /**
   * Returns number from defined range, if number is not in defined range return
   * min or max depends on number.
   */
  getNumberFromRange(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max);
  }

  /**
   * Returns window viewport rect.
   */
  getWindowViewportRect(): VisibilityRect {
    const win = this._window.getWindow();
    const top = 0;
    const left = 0;
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
   */
  getWindowScrollPosition() {
    const left = window.scrollX || 0;
    const top = window.scrollX || 0;

    return { top, left };
  }

  /**
   * Returns the size of an element and its position relative to the viewport
   * and add extended value to returned rect.
   */
  getBoundingClientRect(
    element: HTMLElement,
    { width = 0, height = 0 }: { width?: number; height?: number },
    extended = 0
  ): VisibilityRect {
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

    const elmRectStyle = {
      top: clientRect.top - extended,
      left: clientRect.left - extended,
      width: clientRect.width + 2 * extended,
      height: (clientRect.height || height || 0 / width || 0) + 2 * extended,
    };

    return elmRectStyle;
  }
}
