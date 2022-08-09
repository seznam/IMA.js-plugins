import { AbstractComponent } from '@ima/core';
import ReactDOM from 'react-dom';

const IS_AT_CLIENT_SIDE = typeof window !== 'undefined';

/**
 * Private field symbols.
 *
 * @type {Object<string, symbol>}
 */
const PRIVATE = {
  // fields
  eventBusListeners: Symbol('eventBusListeners'),
  domListeners: Symbol('domListeners'),
  dispatcherListeners: Symbol('dispatcherListeners'),
  pendingTimeouts: Symbol('pendingTimeouts'),
  activeIntervals: Symbol('activeIntervals'),
  boundListeners: Symbol('boundListeners'),

  // methods
  registerListener: Symbol('registerListener'),
  deregisterListener: Symbol('deregisterListener'),
  bindUiEventListeners: Symbol('bindUiEventListeners')
};
if ($Debug) {
  Object.freeze(PRIVATE);
}

/**
 * Abstract UI component that automatically manages the registered DOM, event
 * bus and dispatcher event listeners, timeouts and intervals. The component
 * automatically deregisters all of these right before the component unmounts
 * from the DOM.
 *
 * @abstract
 */
export default class AbstractManagedComponent extends AbstractComponent {
  /**
   * Initializes the component.
   *
   * @param {Object<string, *>} props Component properties.
   * @param {Object<string, *>} context Component's context.
   */
  constructor(props, context) {
    super(props, context);

    if ($Debug) {
      if (!this.utils || !this.utils.$Dispatcher) {
        throw new Error(
          'The view utils must be provided to the managed ' +
            'component either via props or context as $Utils ' +
            "property. The property's value must be an object with " +
            'the IMA event dispatcher available through the ' +
            '$Dispatcher property'
        );
      }
    }

    if (
      this.componentWillUnmount !==
      AbstractManagedComponent.prototype.componentWillUnmount
    ) {
      const currentComponentWillUnmount = this.componentWillUnmount;

      this.componentWillUnmount = () => {
        currentComponentWillUnmount.call(this);
        // Possible repeated calls to our implementation of the
        // componentWillUnmount method will have no effect.
        AbstractManagedComponent.prototype.componentWillUnmount.call(this);
      };
    }

    if (IS_AT_CLIENT_SIDE) {
      const currentRender = this.render;

      this.render = () =>
        this[PRIVATE.bindUiEventListeners](currentRender.call(this));
    }

    /**
     * Storage of the registered DOM event listeners.
     *
     * @type {Map<EventTarget, Map<string, Map<
     *         function(Event),
     *         function(Event)
     *       >>>}
     */
    this[PRIVATE.domListeners] = new Map();

    /**
     * Storage of the registered event bus listeners.
     *
     * @type {Map<EventTarget, Map<string, Map<
     *         function(Event),
     *         function(Event)
     *       >>>}
     */
    this[PRIVATE.eventBusListeners] = new Map();

    /**
     * Map of dispatcher event names to the registered callbacks.
     *
     * @type {Map<string, Set<function(*)>>}
     */
    this[PRIVATE.dispatcherListeners] = new Map();

    /**
     * Map of registered callbacks executed with a delay that have not
     * been executed yet to the native timeout IDs.
     *
     * @type {Map<function(), number>}
     */
    this[PRIVATE.pendingTimeouts] = new Map();

    /**
     * Map of registered callbacks executed periodically to the native
     * interval IDs.
     *
     * @type {Map<function(), number>}
     */
    this[PRIVATE.activeIntervals] = new Map();

    /**
     * Map of references to this component's event processing listeners to
     * their bound wrappers bound to this component's instance. This is
     * a cache for bound functions generated during binding of the event
     * listeners methods used in the render method.
     *
     * @type {Map<function(Event), function(Event)>}
     */
    this[PRIVATE.boundListeners] = new Map();
  }

  /**
   * Registers the provided event listener for execution when the
   * specified event occurs at the specified event target.
   *
   * The listener will be automatically deregistered right before the
   * component will be unmounted from the DOM (by the
   * {@linkcode componentWillUnmount()} method).
   *
   * The listener will automatically have its {@code this} context bound
   * to this instance.
   *
   * @param {(React.Component|EventTarget)} eventTarget The event target
   *        at which the event is to be listened for.
   * @param {string} eventName The name of the event to listen for.
   * @param {function(Event)} listener The listener to register.
   */
  addDomListener(eventTarget, eventName, listener) {
    if (!eventTarget.addEventListener) {
      eventTarget = ReactDOM.findDOMNode(eventTarget); // eslint-disable-line react/no-find-dom-node
    }

    const realListener = this[PRIVATE.registerListener](
      this[PRIVATE.domListeners],
      eventTarget,
      eventName,
      listener
    );

    if (realListener) {
      eventTarget.addEventListener(eventName, realListener);
    }
  }

  /**
   * Deregisters the specified event listener from execution of the
   * specified DOM event on the provided event target.
   *
   * The method has no effect if the listener is not registered.
   *
   * @param {(React.Component|EventTarget)} eventTarget The event target
   *        at which the event was listened for.
   * @param {string} eventName The name of the event listened for.
   * @param {function(Event)} listener The listener to deregister.
   */
  removeDomListener(eventTarget, eventName, listener) {
    if (!eventTarget.addEventListener) {
      eventTarget = ReactDOM.findDOMNode(eventTarget); // eslint-disable-line react/no-find-dom-node
    }

    const realListener = this[PRIVATE.deregisterListener](
      this[PRIVATE.domListeners],
      eventTarget,
      eventName,
      listener
    );

    if (realListener) {
      eventTarget.removeEventListener(eventName, realListener);
    }
  }

  /**
   * Registers the provided event listener for execution whenever an
   * IMA.js DOM custom event of the specified name occurs at the
   * specified event target.
   *
   * The listener will be automatically deregistered right before the
   * component will be unmounted from the DOM (by the
   * {@linkcode componentWillUnmount()} method).
   *
   * The listener will automatically have its {@code this} context bound
   * to this instance.
   *
   * @param {(React.Element|EventTarget)} eventTarget The react component
   *        or event target at which the listener should listen for the
   *        event.
   * @param {string} eventName The name of the event for which to listen.
   * @param {function(Event)} listener The listener for event to
   *        register.
   */
  listen(eventTarget, eventName, listener) {
    const realListener = this[PRIVATE.registerListener](
      this[PRIVATE.eventBusListeners],
      eventTarget,
      eventName,
      listener
    );

    if (realListener) {
      super.listen(eventTarget, eventName, realListener);
    }
  }

  /**
   * Deregisters the provided event listener for an IMA.js DOM custom
   * event of the specified name at the specified event target.
   *
   * @param {(React.Element|EventTarget)} eventTarget The react component
   *        or event target at which the listener should listen for the
   *        event.
   * @param {string} eventName The name of the event for which to listen.
   * @param {function(Event)} listener The listener for event to
   *        register.
   */
  unlisten(eventTarget, eventName, listener) {
    const realListener = this[PRIVATE.deregisterListener](
      this[PRIVATE.eventBusListeners],
      eventTarget,
      eventName,
      listener
    );

    if (realListener) {
      super.unlisten(eventTarget, eventName, realListener);
    }
  }

  /**
   * Registers the provided event listener to be executed when the
   * specified event occurs on the IMA event dispatcher.
   *
   * The listener will be automatically deregistered right before the
   * component will be unmounted from the DOM (by the
   * {@linkcode componentWillUnmount()} method).
   *
   * The listener will automatically have its {@code this} context bound
   * to this instance.
   *
   * @param {string} eventName The name of the event.
   * @param {function(*)} listener The event listener to register.
   */
  addDispatcherListener(eventName, listener) {
    if (!this[PRIVATE.dispatcherListeners].has(eventName)) {
      this[PRIVATE.dispatcherListeners].set(eventName, new Set());
    }

    const listeners = this[PRIVATE.dispatcherListeners].get(eventName);

    this.utils.$Dispatcher.listen(eventName, listener, this);

    listeners.add(listener);
  }

  /**
   * Deregisters the provided event listener from execution of the
   * occurrence of the specified event on the IMA event dispatcher.
   *
   * The method has no effect if the listener is not registered.
   *
   * @param {string} eventName The name of the event.
   * @param {function(*)} listener The event listener to deregister.
   */
  removeDispatcherListener(eventName, listener) {
    if (!this[PRIVATE.dispatcherListeners].has(eventName)) {
      return;
    }

    const listeners = this[PRIVATE.dispatcherListeners].get(eventName);
    if (!listeners.has(listener)) {
      return;
    }

    this.utils.$Dispatcher.unlisten(eventName, listener, this);

    listeners.delete(listener);
    if (!listeners.size) {
      this[PRIVATE.dispatcherListeners].delete(eventName);
    }
  }

  /**
   * Registers the provided callback to be executed after the specified
   * delay.
   *
   * The callback will be automatically deregistered right before the
   * component will be unmounted from the DOM (by the
   * {@linkcode componentWillUnmount()} method).
   *
   * The callback will automatically have its {@code this} context bound
   * to this instance.
   *
   * @param {function()} callback The callback to schedule for execution.
   * @param {number} delay The delay in milliseconds after which the
   *        callback should be executed.
   */
  setTimeout(callback, delay) {
    if (this[PRIVATE.pendingTimeouts].has(callback)) {
      throw new Error(
        'The provided callback is already pending to be executed. ' +
          'If you need to reschedule the callback execution, clear ' +
          "the callback's scheduled timeout execution using the " +
          'clearTimeout() method first'
      );
    }

    const timeoutId = setTimeout(() => {
      callback.call(this);
      this[PRIVATE.pendingTimeouts].delete(callback);
    }, delay);

    this[PRIVATE.pendingTimeouts].set(callback, timeoutId);
  }

  /**
   * Cancels the scheduled delayed execution of the provided callback. The
   * method has no effect if the callback is not registered for delayed
   * execution.
   *
   * @param {function()} callback The callback that is scheduled for
   *        execution.
   */
  clearTimeout(callback) {
    if (!this[PRIVATE.pendingTimeouts].has(callback)) {
      return; // nothing to do
    }

    clearTimeout(this[PRIVATE.pendingTimeouts].get(callback));

    this[PRIVATE.pendingTimeouts].delete(callback);
  }

  /**
   * Registers the provided callback to be executed periodically.
   *
   * The callback will be automatically deregistered right before the
   * component will be unmounted from the DOM (by the
   * {@linkcode componentWillUnmount()} method).
   *
   * The callback will automatically have its {@code this} context bound
   * to this instance.
   *
   * @param {function()} callback The callback to execute periodically.
   * @param {number} period The time period at which the provided
   *        callback should be executed, in milliseconds.
   */
  setInterval(callback, period) {
    if (this[PRIVATE.activeIntervals].has(callback)) {
      throw new Error(
        'The provided callback is already registered to be executed ' +
          'periodically. If you need to reschedule the callback ' +
          "execution, clear the callback's scheduled interval " +
          'execution using the clearInterval() method first'
      );
    }

    const intervalId = setInterval(() => {
      callback.call(this);
    }, period);

    this[PRIVATE.activeIntervals].set(callback, intervalId);
  }

  /**
   * Cancels the periodic execution of the provided callback. The method
   * has no effect if the callback is not registered of execution.
   *
   * @param {function()} callback The callback that should no longer be
   *        executed periodically.
   */
  clearInterval(callback) {
    if (!this[PRIVATE.activeIntervals].has(callback)) {
      return; // nothing to do
    }

    clearInterval(this[PRIVATE.activeIntervals].get(callback));

    this[PRIVATE.activeIntervals].delete(callback);
  }

  /**
   * Deregisters all the registered event bus, dispatcher and DOM event
   * listeners and cancels all the pending timeouts and active intervals
   * registered by this component.
   *
   * @override
   */
  componentWillUnmount() {
    const eventBusListeners = this[PRIVATE.eventBusListeners];

    for (const eventTarget of eventBusListeners.keys()) {
      const eventListeners = eventBusListeners.get(eventTarget);

      for (const eventName of eventListeners.keys()) {
        const realListeners = eventListeners.get(eventName).values();

        for (const realListener of realListeners) {
          super.unlisten(eventTarget, eventName, realListener);
        }
      }
    }

    const domListeners = this[PRIVATE.domListeners];

    for (const eventTarget of domListeners.keys()) {
      const eventListeners = domListeners.get(eventTarget);

      for (const eventName of eventListeners.keys()) {
        const realListeners = eventListeners.get(eventName).values();

        for (const realListener of realListeners) {
          eventTarget.removeEventListener(eventName, realListener);
        }
      }
    }

    const dispatcherListeners = this[PRIVATE.dispatcherListeners];

    for (const eventName of dispatcherListeners.keys()) {
      for (const listener of dispatcherListeners.get(eventName)) {
        this.utils.$Dispatcher.unlisten(eventName, listener, this);
      }
    }

    for (const timeoutId of this[PRIVATE.pendingTimeouts].values()) {
      clearTimeout(timeoutId);
    }

    for (const intervalId of this[PRIVATE.activeIntervals].values()) {
      clearInterval(intervalId);
    }

    // clear the managed listeners
    this[PRIVATE.eventBusListeners].clear();
    this[PRIVATE.domListeners].clear();
    this[PRIVATE.dispatcherListeners].clear();
    this[PRIVATE.pendingTimeouts].clear();
    this[PRIVATE.activeIntervals].clear();
  }

  /**
   * Registers the specified event listeners within the provided storage.
   * The structure of the storage will be automatically updated as
   * necessary.
   *
   * The method returns a new listener that will execute the provided
   * listener with the {@code this} context bound to this component
   * instance.
   *
   * @param {Map<EventTarget, Map<string, Map<
   *          function(Event),
   *          function(Event)
   *        >>>} listenerStorage The storage of the managed events.
   * @param {(React.Component|EventTarget)} eventTarget The event target
   *        at which the event will be listened for.
   * @param {string} eventName The name of the event on which the
   *        listener is to be executed.
   * @param {function(*)} listener The event listener to execute on the
   *        specified event's occurrence.
   * @returns {?function(*)} The listener to pass to the underlying event
   *         API.
   */
  [PRIVATE.registerListener](
    listenerStorage,
    eventTarget,
    eventName,
    listener
  ) {
    if (!eventTarget.addEventListener) {
      eventTarget = ReactDOM.findDOMNode(eventTarget); // eslint-disable-line react/no-find-dom-node
    }

    if (!listenerStorage.has(eventTarget)) {
      listenerStorage.set(eventTarget, new Map());
    }

    const eventListeners = listenerStorage.get(eventTarget);

    if (!eventListeners.has(eventName)) {
      eventListeners.set(eventName, new Map());
    }

    const listeners = eventListeners.get(eventName);

    if (listeners.has(listener)) {
      return null; // already listening for the event
    }

    const realListener = listener.bind(this);

    listeners.set(listener, realListener);

    return realListener;
  }

  /**
   * Deregisters the specified event listener from the provided storage.
   * The method automatically clears off the empty parts of the storage's
   * tree structure that would be left after the removal of the event
   * listener.
   *
   * @param {Map<EventTarget, Map<string, Map<
   *          function(Event),
   *          function(Event)
   *        >>>} listenerStorage The storage of the managed events.
   * @param {(React.Component|EventTarget)} eventTarget The event target
   *        at which the event was listened for.
   * @param {string} eventName The name of the event on which the
   *        listener was to be executed.
   * @param {function(*)} listener The listener that was to be executed
   *        on the specified event's occurrence.
   * @returns {?function(*)} The listener that was passed to the
   *         underlying event API, or {@code null} if the provided
   *         listener was not registered.
   */
  [PRIVATE.deregisterListener](
    listenerStorage,
    eventTarget,
    eventName,
    listener
  ) {
    if (!eventTarget.addEventListener) {
      eventTarget = ReactDOM.findDOMNode(eventTarget); // eslint-disable-line react/no-find-dom-node
    }

    if (!listenerStorage.has(eventTarget)) {
      return null;
    }

    const eventListeners = listenerStorage.get(eventTarget);

    if (!eventListeners.has(eventName)) {
      return null;
    }

    const listeners = eventListeners.get(eventName);

    if (!listeners.has(listener)) {
      return null;
    }

    const realListener = listeners.get(listener);

    listeners.delete(listener);

    if (!listeners.size) {
      eventListeners.delete(eventName);
    }

    if (!eventListeners.size) {
      listenerStorage.delete(eventTarget);
    }

    return realListener;
  }

  /**
   * Post-processes the react element tree generated by this component's
   * {@linkcode render} method by binding all event listeners
   *
   * @param {?(boolean|number|string|React.Element|Array<React.Element>)} reactElement
   *        The root react element created by this component's render()
   *        method.
   * @returns {?(boolean|number|string|React.Element|Array<React.Element>)}
   *         The post-processed tree of react elements.
   */
  [PRIVATE.bindUiEventListeners](reactElement) {
    if (!(reactElement instanceof Object)) {
      return reactElement;
    }

    if (reactElement instanceof Array) {
      return reactElement.map(child =>
        this[PRIVATE.bindUiEventListeners](child)
      );
    }

    let clone;
    let props;

    if (Object.isFrozen(reactElement)) {
      clone = Object.assign({}, reactElement);
      Object.defineProperty(clone, '_self', {
        enumerable: false,
        configurable: false,
        value: reactElement._self
      });
      Object.defineProperty(clone, '_source', {
        enumerable: false,
        configurable: false,
        value: reactElement._source
      });

      props = clone.props && Object.assign({}, clone.props);
    } else {
      clone = reactElement;
      props = clone.props;
    }

    if (props) {
      for (const propertyName of Object.keys(props)) {
        if (
          !propertyName.startsWith('on') ||
          typeof props[propertyName] !== 'function'
        ) {
          continue;
        }

        const callback = props[propertyName];
        let boundCallback;

        if (this[PRIVATE.boundListeners].has(callback)) {
          boundCallback = this[PRIVATE.boundListeners].get(callback);
        } else {
          boundCallback = callback.bind(this);
          this[PRIVATE.boundListeners].set(callback, boundCallback);
        }

        props[propertyName] = boundCallback;
      }

      if (props.children instanceof Array) {
        props.children = props.children.map(child =>
          this[PRIVATE.bindUiEventListeners](child)
        );
      } else if (props.children instanceof Object) {
        props.children = this[PRIVATE.bindUiEventListeners](props.children);
      }

      clone.props = props;
    }

    if (typeof clone.ref === 'function') {
      let boundCallback;

      if (this[PRIVATE.boundListeners].has(clone.ref)) {
        boundCallback = this[PRIVATE.boundListeners].get(clone.ref);
      } else {
        boundCallback = clone.ref.bind(this);
        this[PRIVATE.boundListeners].set(clone.ref, boundCallback);
      }

      clone.ref = boundCallback;
    }

    if ($Debug) {
      Object.freeze(clone);
      Object.freeze(clone.props);
    }

    return clone;
  }
}
