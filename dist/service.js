'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Script loader service class
 *
 * @class Service
 * @namespace Module.ScriptLoader
 * @module Module
 * @submodule Module.ScriptLoader
 */

var Service = function () {

	/**
  * @method constructor
  * @constructor
  * @param {Core.Interface.Window} window
  * @param {Core.Interface.Dispatcher} dispatcher
  * @param {Object<string, string>} EVENTS
  */

	function Service(window, dispatcher, EVENTS) {
		babelHelpers.classCallCheck(this, Service);


		/**
   * IMA.js Window
   *
   * @private
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
   * ScriptLoader defined EVENTS.
   *
   * @const
   * @property _EVENTS
   * @type {Object<string, string>}
   */
		this._EVENTS = EVENTS;

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
  * @param {string?} [template=null]
  * @return {Promise<Object<string, *>>}
  */


	babelHelpers.createClass(Service, [{
		key: 'load',
		value: function load(url) {
			var _this = this;

			var template = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			if (!this._window.isClient()) {
				return Promise.reject({ url: url, error: new Error('The script ' + url + ' can not be loaded on the client side.') });
			}

			if (this._loadedScripts[url]) {
				return this._loadedScripts[url];
			}

			this._loadedScripts[url] = new Promise(function (resolve, reject) {
				var script = document.createElement('script');

				if (template) {
					script.innerHTML = template;
					setTimeout(function () {
						return _this._handleOnLoad(url, resolve);
					}, 0);
				} else {
					script.async = true;
					script.onload = function (event) {
						return _this._handleOnLoad(url, resolve);
					};
					script.onerror = function (event) {
						return _this._handleOnError(url, reject);
					};
					script.src = url;
				}

				var firstScript = _this._window.querySelectorAll('script')[0];
				firstScript.parentNode.insertBefore(script, firstScript);
			});

			return this._loadedScripts[url];
		}

		/**
   * Handle on load event for script. Resolve load promise and fire LOADED events.
   *
   * @private
   * @method _handleOnLoad
   * @param {string} url
   * @param {function} resolve
   */

	}, {
		key: '_handleOnLoad',
		value: function _handleOnLoad(url, resolve) {
			var data = { url: url };

			resolve(data);
			this._dispatcher.fire(this._EVENTS.LOADED, data, true);
		}

		/**
   * Handle on error event for script. Reject load promise and fire LOADED events.
   *
   * @private
   * @method _handleOnError
   * @param {string} url
   * @param {function} reject
   */

	}, {
		key: '_handleOnError',
		value: function _handleOnError(url, reject) {
			var data = { url: url, error: new Error('The script ' + url + ' was not be loaded.') };

			reject(data);
			this._dispatcher.fire(this._EVENTS.LOADED, data, true);
		}
	}]);
	return Service;
}();

exports.default = Service;
;