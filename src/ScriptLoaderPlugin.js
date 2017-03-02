import Events from './Events';
import ResourceLoader from './ResourceLoader';

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
		this._loadedScripts = {};
	}

	/**
	 * Load third party script to page.
	 *
	 * @param {string} url
	 * @param {string=} [template]
	 * @return {Promise<{url: string}>}
	 */
	load(url, template) {
		if ($Debug) {
			if (!this._window.isClient()) {
				throw new Error(
					`The script loader cannot be used at the server side. ` +
					`Attempted to load the ${url} script.`
				);
			}
		}

		if (this._loadedScripts[url]) {
			return this._loadedScripts[url];
		}

		let script = this._createScriptElement();
		if (template) {
			script.innerHTML = template;
		} else {
			script.async = true;
			script.onload = (event) => this._handleOnLoad(url);
			script.onerror = (event) => this._handleOnError(url);
			script.src = url;
		}

		let loader = new ResourceLoader(script, template || url);
		this._loadedScripts[url] = loader.loadPromise
			.then(() => this._handleOnLoad(url))
			.catch(() => this._handleOnError(url));

		loader.injectToPage();

		if (template) {
			setTimeout(() => script.onload(), 0);
		}

		return this._loadedScripts[url];
	}

	/**
	 * Creates a new script element and returns it.
	 *
	 * @return {HTMLScriptElement} The created script element.
	 */
	_createScriptElement() {
		return document.createElement('script');
	}

	/**
	 * Handle on load event for script. Resolve load promise and fire LOADED
	 * events.
	 *
	 * @param {string} url
	 * @return {{url: string}}
	 */
	_handleOnLoad(url) {
		this._dispatcher.fire(Events.LOADED, data, true);
		return data;
	}

	/**
	 * Handle on error event for script. Reject load promise and fire LOADED
	 * events.
	 *
	 * @param {string} url
	 * @throws Error
	 */
	_handleOnError(url) {
		let error = new Error(`The ${url} script failed to load.`);
		let data = {
			url,
			error
		};

		this._dispatcher.fire(Events.LOADED, data, true);
		throw error;
	}
}
