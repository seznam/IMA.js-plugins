export default class WebSocket {
  static get $dependencies() {
    return ['$Window', '$Settings.plugin.websocket'];
  }

  constructor(window, config) {
    /**
     * @type {import('@ima/core').Window}
     */
    this._window = window;

    /**
     * @type {{url: string}}
     */
    this._config = config;

    /**
     * @type {?WebSocket}
     */
    this._socket = null;

    /**
     * @type {any[]}
     */
    this._observers = [];
  }

  init() {
    if (this._window.isClient()) {
      this._connect();
    }
  }

  send(data) {
    if (this._window.isClient() && this._socket) {
      this._socket.send(data);
    }
  }

  destroy() {
    if (this._window.isClient() && this._socket) {
      this._socket.close();
      this._socket = null;
    }
  }

  /**
   * @param  {Function} [observer=() => {}]
   */
  subscribe(observer = () => {}) {
    this._observers.push(observer);
  }

  /**
   * @param  {Function} [observer=() => {}]
   */
  unsubscribe(observer = () => {}) {
    const index = this._observers.indexOf(observer);

    if (index !== -1) {
      this._observers.splice(index, 1);
    }
  }

  /**
   * Returns count of observers.
   *
   * @returns {number} The number of observers.
   */
  observersCount() {
    return this._observers.length;
  }

  /**
   * The method notify all observers.
   *
   * @param  {*} data
   */
  _notify(data) {
    this._observers.forEach(observer => observer(data));
  }

  _connect() {
    this._socket = Reflect.construct(window.WebSocket, [this._config.url]);

    this._socket.onmessage = event => {
      try {
        let data = JSON.parse(event.data);

        if (this._config.debug) {
          console.debug(...data.payload); // eslint-disable-line no-console
        }

        this._notify(data);
      } catch (error) {
        if (this._config.debug) {
          console.error(error); // eslint-disable-line no-console
        }
      }
    };

    this._socket.onerror = error => {
      console.error(error); // eslint-disable-line no-console
    };
  }
}
