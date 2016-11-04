/**
 * Abstract analytic class
 */
export default class AbstractAnalytic {

	/**
	 * @param {ima.plugin.script.loader.ScriptLoaderPlugin} scriptLoader
	 * @param {ima.window.Window} window
	 * @param {ima.event.Dispatcher} dispatcher
	 * @param {Object<string, *>} config
	 */
	constructor(scriptLoader, window, dispatcher, config) {

		/**
		 * Handler from ima-plugin-script-loader.
		 *
		 * @protected
		 * @type {ima.plugin.script.loader.ScriptLoaderPlugin}
		 */
		this._scriptLoader = scriptLoader;

		/**
		 * IMA.js Window
		 *
		 * @protected
		 * @type {ima.window.Window}
		 */
		this._window = window;

		/**
		 * IMA.js Dispatcher
		 *
		 * @protected
		 * @type {ima.event.Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * Analytic config
		 *
		 * @protected
		 * @type {(Object<string, *>)}
		 */
		this._config = config;

		/**
		 * Analytic script url.
		 *
		 * @protected
		 * @type {?string}
		 */
		this._analyticScriptUrl = null;

		/**
		 * If flag has value true then analytic is enable for hit events.
		 *
		 * @protected
		 * @type {boolean}
		 */
		this._enable = false;
	}

	/**
	 * Initialization analytic.
	 *
	 * @method init
	 */
	init() {
		if (
			!this.isEnabled() &&
			this._window.isClient() &&
			this._analyticScriptUrl
		) {
			this._scriptLoader
				.load(this._analyticScriptUrl, this.getTemplate())
				.then(() => {
					this._configuration();
				})
				.catch((errorResponse) => {
					console.log(errorResponse.url, errorResponse.error);
				});
		}
	}

	/**
	 * Returns template for loading script.
	 *
	 * @abstract
	 * @return {?string}
	 */
	getTemplate() {
		throw new Error(
			'The getTemplate() method is abstract and must be overridden.'
		);
	}

	/**
	 * Returns true if analytic is enabled.
	 *
	 * @return {boolean}
	 */
	isEnabled() {
		return this._enable;
	}

	/**
	 * Hit event to analytic with defined data. If analytic is not configured then
	 * defer hit to storage.
	 *
	 * @abstract
	 * @param {Object<string, *>} data
	 */
	hit(data) {
		throw new Error(
			'The hit() method is abstract and must be overridden.'
		);
	}

	/**
	 * Hit page view event to analytic for defined page data.
	 *
	 * @abstract
	 * @param {Object<string, *>} pageData
	 */
	hitPageView(pageData) {
		throw new Error(
			'The hitPageView() method is abstract and must be overridden.'
		);
	}

	/**
	 * Configuration analytic
	 *
	 * @abstract
	 * @protected
	 */
	_configuration() {
		throw new Error(
			'The _configuration() method is abstract and must be overridden.'
		);
	}
}
