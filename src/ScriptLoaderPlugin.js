import Events from './events';

/**
 * Script loader plugin class.
 */
export default class ScriptLoaderPlugin {

	/**
	 * Initializes the script loader.
	 *
	 * @param {ima.window.Window} window
	 * @param {ima.event.Dispatcher} dispatcher
	 */
	constructor(window, dispatcher) {

		/**
		 * IMA.js Window
		 *
		 * @type {ima.window.Window}
		 */
		this._window = window;

		/**
		 * IMA.js Dispatcher
		 *
		 * @type {ima.event.Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * Object of loaded scripts.
		 *
		 * @type {Object<string, Promise<{url: string}>>}
		 */
		this._loadedScripts = [];
	}

	/**
	 * Load third party script to page.
	 *
	 * @param {string} url
	 * @param {string=} [template]
	 * @return {Promise<{url: string}>}
	 */
	load(url, template) {
		if (!this._window.isClient()) {
			return Promise.reject(new Error(
				`The ${url} script cannot be loaded at the server side.`
			));
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
	 * @param {HTMLScriptElement} script
	 */
	_insertScriptToPage(script) {
		let firstScript = this._window.querySelectorAll('script')[0];

		firstScript.parentNode.insertBefore(script, firstScript);
	}

	/**
	 * Create new script element and return it.
	 *
	 * @return {HTMLScriptElement}
	 */
	_createScriptElement() {
		return document.createElement('script');
	}

	/**
	 * Handle on load event for script. Resolve load promise and fire LOADED
	 * events.
	 *
	 * @param {string} url
	 * @param {function} resolve
	 */
	_handleOnLoad(url, resolve) {
		let data = { url };

		resolve(data);
		this._dispatcher.fire(Events.LOADED, data, true);
	}

	/**
	 * Handle on error event for script. Reject load promise and fire LOADED
	 * events.
	 *
	 * @param {string} url
	 * @param {function(Error)} reject
	 */
	_handleOnError(url, reject) {
		let error = new Error(`The ${url} script failed to load.`);
		let data = {
			url,
			error
		};

		reject(error);
		this._dispatcher.fire(Events.LOADED, data, true);
	}
}
