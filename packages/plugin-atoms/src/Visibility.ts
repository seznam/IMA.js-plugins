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

  private window: ClientWindow;
  private dispatcher: Dispatcher;
  private afterHandleRouteCalled = false;
  circle: Circle;

  constructor(window: ClientWindow, dispatcher: Dispatcher) {
    this.window = window;
    this.dispatcher = dispatcher;
    this.circle = this.createVisibilityCircle();
  }

  /**
   * Create visibility circle.
   */
  private createVisibilityCircle() {
    return new Circle({
      listen: (notify: any) => this.listenOnEvents(notify),
      unlisten: (notify: any) => this.unlistenOnEvents(notify),
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

    if (this.afterHandleRouteCalled) {
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
    const window = this.window.getWindow();
    interval = interval || 0;
    let callTime = 0;
    let lastArguments: any = null;

    if (context) {
      eventHandler = eventHandler.bind(context);
    }

    if (!this.window.isClient()) {
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
  private listenOnEvents(notify: NotifyCallback) {
    this.dispatcher.listen(
      RouterEvents.BEFORE_HANDLE_ROUTE,
      this.beforeHandleRoute,
      this
    );
    this.dispatcher.listen(
      RouterEvents.AFTER_HANDLE_ROUTE,
      this.afterHandleRoute,
      this
    );
    this.window.bindEventListener(this.window.getWindow(), 'resize', notify);
    this.window.bindEventListener(this.window.getWindow(), 'scroll', notify);
  }

  /**
   * The visibility helper stop checking visibility of registered entries.
   */
  private unlistenOnEvents(notify: NotifyCallback) {
    this.dispatcher.unlisten(
      RouterEvents.BEFORE_HANDLE_ROUTE,
      this.beforeHandleRoute,
      this
    );
    this.dispatcher.unlisten(
      RouterEvents.AFTER_HANDLE_ROUTE,
      this.afterHandleRoute,
      this
    );
    this.window.unbindEventListener(this.window.getWindow(), 'resize', notify);
    this.window.unbindEventListener(this.window.getWindow(), 'scroll', notify);
  }

  /**
   * The method resets `afterHandleRoute` marker.
   */
  private beforeHandleRoute() {
    this.afterHandleRouteCalled = false;
  }

  /**
   * The method normalize routeInfo to {@notifyPayload}.
   */
  private afterHandleRoute(routeInfo: any) {
    this.afterHandleRouteCalled = true;

    const payload = Object.assign(
      { type: RouterEvents.AFTER_HANDLE_ROUTE },
      routeInfo
    );

    this.notify(payload);
  }
}
