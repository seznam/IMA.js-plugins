'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Abstract analytic class
 *
 * @class Abstract
 * @namespace Module.Analytic
 * @module Module
 * @submodule Module.Analytic
 */
class Abstract {

	/**
  * @method constructor
  * @constructor
  * @param {Module.ScriptLoader.Handler} scriptLoader
  * @param {Core.Interface.Window} window
  * @param {Core.Interface.Dispatcher} dispatcher
  * @param {Object<string, string>} EVENTS
  * @param {Object<string, *>} config
  */
	constructor(scriptLoader, window, dispatcher, EVENTS, config) {

		/**
   * Handler from ima.js-module-script-loader.
   *
   * @protected
   * @property _scriptLoader
   * @type {Module.ScriptLoader.Handler}
   */
		this._scriptLoader = scriptLoader;

		/**
   * IMA.js Window
   *
   * @protected
   * @property _window
   * @type {Core.Interface.Window}
   */
		this._window = window;

		/**
   * IMA.js Dispatcher
   *
   * @private
   * @property _dispatcher
   * @type {Core.Interface.Dispatcher}
   */
		this._dispatcher = dispatcher;

		/**
   * Analytic defined EVENTS.
   *
   * @const
   * @property _EVENTS
   * @type {Object<string, string>}
   */
		this._EVENTS = EVENTS;

		/**
   * Analytic config
   *
   * @protected
   * @property _config
   * @type {(Object<string, *>)}
   */
		this._config = config;

		/**
   * Analytic script url.
   *
   * @protected
   * @property _analyticScriptUrl
   * @type {string?}
   */
		this._analyticScriptUrl = null;

		/**
   * If flag has value true then analytic is enable for hit events.
   *
   * @protected
   * @property _enable
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
		if (!this.isEnabled() && this._window.isClient() && this._analyticScriptUrl) {

			this._scriptLoader.load(this._analyticScriptUrl, this.getTemplate()).then(() => {
				this._configuration();
			}).catch(errorResponse => {
				console.log(errorResponse.url, errorResponse.error);
			});
		}
	}

	/**
  * Returns template for loading script.
  *
  * @abstract
  * @method getTemplate
  * @return {string?}
  */
	getTemplate() {
		throw new Error('The getTemplate() method is abstract and must be ' + 'overridden.');
	}

	/**
  * Returns true if analytic is enabled.
  *
  * @protected
  * @method isEnabled
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
  * @method hit
  * @param {Object<string, *>} data
  */
	hit(data) {
		throw new Error('The hit() method is abstract and must be ' + 'overridden.');
	}

	/**
  * Hit page view event to analytic for defined page data.
  *
  * @abstract
  * @method hitPageView
  * @param {Object<string, *>} pageData
  */
	hitPageView(pageData) {
		throw new Error('The hitPageView() method is abstract and must be ' + 'overridden.');
	}

	/**
  * Configuration analytic
  *
  * @abstract
  * @protected
  * @method _configuration
  */
	_configuration() {
		throw new Error('The _configuration() method is abstract and must be ' + 'overridden.');
	}
}
exports.default = Abstract;