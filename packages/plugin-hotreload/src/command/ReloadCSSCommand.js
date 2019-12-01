import { Window } from '@ima/core';
import Command from './Command';

const CSS_HOTRELOAD_ID = 'ima-plugin-hotreload';

export default class ReloadCSSCommand extends Command {
  static get $dependencies() {
    return [Window];
  }

  constructor(window) {
    super();

    /**
     * @type {Window}
     */
    this._window = window;
  }

  execute(payload) {
    const document = this._window.getDocument();

    // inject or reuse header style tag for actual style
    let styleElement = document.getElementById(CSS_HOTRELOAD_ID);
    if (styleElement) {
      styleElement.innerHTML = payload.contents;
    } else {
      styleElement = document.createElement('style');
      styleElement.setAttribute('id', CSS_HOTRELOAD_ID);
      styleElement.innerHTML = payload.contents;
      document.head.appendChild(styleElement);
    }
  }
}
