/**
 * Script loader plugin class
 *
 * @class ScriptLoaderPlugin
 * @namespace ima.plugin.script.loader
 * @module ima
 * @submodule ima.plugin
 */
export default class ScriptLoaderPlugin {

	/**
	 * @method constructor
	 * @constructor
	 * @param {ima.window.Window} window
	 * @param {ima.event.Dispatcher} dispatcher
	 * @param {Object<string, string>} Events
	 */
	constructor(window, dispatcher, Events) {

		/**
		 * IMA.js Window
		 *
		 * @private
		 * @property _window
		 * @type {ima.window.Window}
		 */
		this._window = window;

		/**
		 * IMA.js Dispatcher
		 *
		 * @private
		 * @property _dispatcher
		 * @type {ima.event.Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * ScriptLoader defined Events.
		 *
		 * @const
		 * @property _Events
		 * @type {Object<string, string>}
		 */
		this._Events = Events;

		/**
		 * Object of loaded scripts.
		 *
		 * @private
		 * @property _loadedScripts
		 * @type {Object<string, Promise>}
		 */
		this._loadedScripts = [];
	}

	/**
	 * Load third party script to page.
	 *
	 * @method load
	 * @param {string} url
	 * @param {string?} [template]
	 * @return {Promise<Object<string, *>>}
	 */
	load(url, template) {
		if (!this._window.isClient()) {
			return Promise.reject({ url, error: new Error(`The script ${url} can not be loaded on the client side.`) });
		}

		if (this._loadedScripts[url]) {
			return this._loadedScripts[url];
		}

		this._loadedScripts[url] = new Promise((resolve, reject) => {
			let script = this._createScriptElement();

			if (template) {
				script.innerHTML = template;
				setTimeout(() => this._handleOnLoad(url, resolve), 0);
			} else {
				script.async = true;
				script.onload = (event) => this._handleOnLoad(url, resolve);
				script.onerror = (event) => this._handleOnError(url, reject);
				script.src = url;
			}

			this._insertScriptToPage(script);
		});

		return this._loadedScripts[url];
	}

	/**
	 * Insert defined script tag to page.
	 *
	 * @private
	 * @method _insertScriptToPage
	 * @param {HTMLScriptElement} script
	 */
	_insertScriptToPage(script) {
		let firstScript = this._window.querySelectorAll('script')[0];

		firstScript.parentNode.insertBefore(script, firstScript);
	}

	/**
	 * Create new script element and return it.
	 *
	 * @private
	 * @method _createScriptElement
	 * @return {HTMLScriptElement}
	 */
	_createScriptElement() {
		return document.createElement('script');
	}

	/**
	 * Handle on load event for script. Resolve load promise and fire LOADED events.
	 *
	 * @private
	 * @method _handleOnLoad
	 * @param {string} url
	 * @param {function} resolve
	 */
	_handleOnLoad(url, resolve) {
		let data = { url };

		resolve(data);
		this._dispatcher.fire(this._Events.LOADED, data, true);
	}

	/**
	 * Handle on error event for script. Reject load promise and fire LOADED events.
	 *
	 * @private
	 * @method _handleOnError
	 * @param {string} url
	 * @param {function} reject
	 */
	_handleOnError(url, reject) {
		let data = { url, error: new Error(`The script ${url} was not be loaded.`) };

		reject(data);
		this._dispatcher.fire(this._Events.LOADED, data, true);
	}
}
