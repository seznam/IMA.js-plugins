import { RouterEvents } from '@ima/core';
import { Circle } from 'infinite-circle';

/**
  @typedef notifyPayload
  @type {object}
  @property {string} type - event type
 /
 
/**
 * @callback notifyCallback
 * @param {notifyPayload} payload
 */

/**
 * Visibility helper.
 */
export default class Visibility {
  static get $dependencies() {
    return ['$Window', '$Dispatcher'];
  }

  constructor(window, dispatcher) {
    /**
     * @property _window
     * @type {import('@ima/core').Window}
     */
    this._window = window;

    /**
     * @property _dispatcher
     * @type {import('@ima/core').Dispatcher}
     */
    this._dispatcher = dispatcher;

    /**
     * @property _afterHandleRouteCalled
     * @type {boolean}
     */
    this._afterHandleRouteCalled = false;

    /**
     * @property circle
     * @type {Circle}
     */
    this.circle = this._createVisibilityCircle();
  }

  /**
   * Create visibility circle.
   *
   * @returns {Circle} The circle instance
   */
  _createVisibilityCircle() {
    return new Circle({
      listen: notify => this._listenOnEvents(notify),
      unlisten: notify => this._unlistenOnEvents(notify),
    });
  }

  /**
   * Register handlers to visibility loop
   *
   * @param {Function} reader
   * @param {Function} writer
   * @param read
   * @param write
   * @param {{ visibilityInterval: number }} meta
   * @returns {number} The registered id
   */
  register(read, write, meta = { visibilityInterval: 180 }) {
    let id = this.circle.register({
      read,
      write,
      meta: { interval: meta.visibilityInterval },
    });

    if (this._afterHandleRouteCalled) {
      this.notify({ id });
    }

    return id;
  }

  /**
   * Unregister handlers from visibility loop
   *
   * @param {number} The registered id
   * @param id
   */
  unregister(id) {
    this.circle.unregister(id);
  }

  /**
   * It cut down calling the event handler for defined interval. The throttle
   * method use requestAnimationFrame function which is called during page
   * scrolling.
   *
   * @function throttle
   * @param {function(...)} eventHandler
   * @param {number?} interval
   * @param {object?} context
   * @returns {function(...)} The throttled event
   */
  throttle(eventHandler, interval, context) {
    let win = this._window.getWindow();
    interval = interval || 0;
    let callTime = 0;
    let lastArguments = null;

    if (context) {
      eventHandler = eventHandler.bind(context);
    }

    if (!this._window.isClient()) {
      return eventHandler;
    }

    function suspendAction() {
      if (callTime <= Date.now() || !win.requestAnimationFrame) {
        callTime = 0;
        eventHandler(...lastArguments);
      } else {
        win.requestAnimationFrame(suspendAction);
      }
    }

    return function throttle(...rest) {
      lastArguments = rest;

      if (!callTime) {
        callTime = Date.now() + interval;
        suspendAction();
      }
    };
  }

  /**
   * The method add circle instance to be running in the next infinite loop.
   *
   * @param {notifyPayload}
   * @param {...any} rest
   */
  notify(...rest) {
    this.circle.notify(...rest);
  }

  /**
   * The visibility helper start checking visibility of registered entries.
   *
   * @param {notifyCallback}
   * @param notify
   */
  _listenOnEvents(notify) {
    this._dispatcher.listen(
      RouterEvents.BEFORE_HANDLE_ROUTE,
      this._beforeHandleRoute,
      this
    );
    this._dispatcher.listen(
      RouterEvents.AFTER_HANDLE_ROUTE,
      this._afterHandleRoute,
      this
    );
    this._window.bindEventListener(this._window.getWindow(), 'resize', notify);
    this._window.bindEventListener(this._window.getWindow(), 'scroll', notify);
  }

  /**
   * The visibility helper stop checking visibility of registered entries.
   *
   * @param {notifyCallback}
   * @param notify
   */
  _unlistenOnEvents(notify) {
    this._dispatcher.unlisten(
      RouterEvents.BEFORE_HANDLE_ROUTE,
      this._beforeHandleRoute,
      this
    );
    this._dispatcher.unlisten(
      RouterEvents.AFTER_HANDLE_ROUTE,
      this._afterHandleRoute,
      this
    );
    this._window.unbindEventListener(
      this._window.getWindow(),
      'resize',
      notify
    );
    this._window.unbindEventListener(
      this._window.getWindow(),
      'scroll',
      notify
    );
  }

  /**
   * The method resets `_afterHandleRoute` marker.
   */
  _beforeHandleRoute() {
    this._afterHandleRouteCalled = false;
  }

  /**
   * The method normalize routeInfo to {@notifyPayload}.
   *
   * @param {object} routeInfo
   */
  _afterHandleRoute(routeInfo) {
    this._afterHandleRouteCalled = true;

    const payload = Object.assign(
      { type: RouterEvents.AFTER_HANDLE_ROUTE },
      routeInfo
    );

    this.notify(payload);
  }
}
