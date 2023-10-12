/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
import {
  ClientWindow,
  Dependencies,
  Dispatcher,
  RouterEvents,
} from '@ima/core';
// @ts-expect-error
import { Circle } from 'infinite-circle';

type NotifyPayload = {
  type: string;
};

type NotifyCallback = (payload: NotifyPayload) => void;

/**
 * Visibility helper.
 */
export default class Visibility {
  static $dependencies: Dependencies = ['$Window', '$Dispatcher'];

  private _window: ClientWindow;
  private _dispatcher: Dispatcher;
  private _afterHandleRouteCalled = false;
  circle: Circle;

  constructor(window: ClientWindow, dispatcher: Dispatcher) {
    this._window = window;
    this._dispatcher = dispatcher;
    this.circle = this._createVisibilityCircle();
  }

  /**
   * Create visibility circle.
   */
  private _createVisibilityCircle() {
    return new Circle({
      listen: (notify: any) => this._listenOnEvents(notify),
      unlisten: (notify: any) => this._unlistenOnEvents(notify),
    });
  }

  /**
   * Register handlers to visibility loop
   */
  register(
    read: (...args: any[]) => any,
    write: (...args: any[]) => any,
    meta = { visibilityInterval: 180 }
  ): number {
    const id = this.circle.register({
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
   */
  unregister(id: number) {
    this.circle.unregister(id);
  }

  /**
   * It cut down calling the event handler for defined interval. The throttle
   * method use requestAnimationFrame function which is called during page
   * scrolling.
   */
  throttle(
    eventHandler: (...args: any[]) => any,
    interval: number,
    context: any
  ) {
    const window = this._window.getWindow();
    interval = interval || 0;
    let callTime = 0;
    let lastArguments: any = null;

    if (context) {
      eventHandler = eventHandler.bind(context);
    }

    if (!this._window.isClient()) {
      return eventHandler;
    }

    function suspendAction() {
      if (callTime <= Date.now() || !window.requestAnimationFrame) {
        callTime = 0;
        eventHandler(...lastArguments);
      } else {
        window.requestAnimationFrame(suspendAction);
      }
    }

    return function throttle(...rest: any[]) {
      lastArguments = rest;

      if (!callTime) {
        callTime = Date.now() + interval;
        suspendAction();
      }
    };
  }

  /**
   * The method add circle instance to be running in the next infinite loop.
   */
  notify(...rest: any[]) {
    this.circle.notify(...rest);
  }

  /**
   * The visibility helper start checking visibility of registered entries.
   */
  private _listenOnEvents(notify: NotifyCallback) {
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
   */
  private _unlistenOnEvents(notify: NotifyCallback) {
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
   * The method resets `afterHandleRoute` marker.
   */
  private _beforeHandleRoute() {
    this._afterHandleRouteCalled = false;
  }

  /**
   * The method normalize routeInfo to {@notifyPayload}.
   */
  private _afterHandleRoute(routeInfo: any) {
    this._afterHandleRouteCalled = true;

    const payload = Object.assign(
      { type: RouterEvents.AFTER_HANDLE_ROUTE },
      routeInfo
    );

    this.notify(payload);
  }
}
