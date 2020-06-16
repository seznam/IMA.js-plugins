import { Window } from '@ima/core';
import { WebSocket } from '@ima/plugin-websocket';
import ReloadJSCommand from './command/ReloadJSCommand';
import ReloadCSSCommand from './command/ReloadCSSCommand';

export const HR_SENTINEL_NAME = '@ima/gulp-tasks/watch/hot-reload';

export default class HotReloadService {
  static get $dependencies() {
    return [Window, WebSocket, ReloadJSCommand, ReloadCSSCommand];
  }

  /**
   * @param {Window} window
   * @param {WebSocket} webSocket
   * @param {ReloadJSCommand} reloadJSCommand
   * @param {ReloadCSSCommand} reloadCSSCommand
   */
  constructor(window, webSocket, reloadJSCommand, reloadCSSCommand) {
    /**
     * @type {Window}
     */
    this._window = window;

    /**
     * @type {?WebSocket}
     */
    this._socket = webSocket;

    /**
     * @type {ReloadJSCommand}
     */
    this._reloadJSCommand = reloadJSCommand;

    /**
     * @type {ReloadCSSCommand}
     */
    this._reloadCSSCommand = reloadCSSCommand;

    /**
     * @type {Array}
     */
    this._actions = [];
  }

  init() {
    if (this._window.isClient()) {
      this._socket.subscribe((data) => this._onMessage(data));

      this._actions.push({
        regexp: new RegExp('static/js/'),
        command: (data) => this._reloadJSCommand.execute(data.payload)
      });
      this._actions.push({
        regexp: new RegExp('static/css/'),
        command: (data) => this._reloadCSSCommand.execute(data.payload)
      });
    }
  }

  _onMessage(data) {
    if (
      data.sentinel &&
      data.sentinel === HR_SENTINEL_NAME &&
      data.payload &&
      data.payload.filename &&
      data.payload.contents
    ) {
      for (const action of this._actions) {
        if (action.regexp.test(data.payload.filename)) {
          action.command(data);
        }
      }
    }
  }
}
