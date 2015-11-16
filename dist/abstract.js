/**
 * Abstract analytic class
 *
 * @class Abstract
 * @namespace Module.Analytic
 * @module Module
 * @submodule Module.Analytic
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Abstract = (function () {

	/**
  * @method constructor
  * @constructor
  * @param {Core.Interface.Window} window
  * @param {Core.Interface.Dispatcher} dispatcher
  * @param {Object<string, string>} EVENTS
  * @param {Object<string, *>} config
  */

	function Abstract(window, dispatcher, EVENTS, config) {
		_classCallCheck(this, Abstract);

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
   * Storage where we store hits for unprepared analytic.
   *
   * @protected
   * @property _storage
   * @type {Array<Object<string, *>>}
   */
		this._storageOfHits = [];

		/**
   * If flag has value true then analytic is enable for hit events.
   *
   * @protected
   * @property _enable
   * @type {boolean}
   */
		this._enable = false;

		/**
   * Timer for trying flush storage.
   *
   * @private
   * @property _timerFlushStorage
   */
		this._timerFlushStorage = null;

		/**
   * Timer for trying configuration analytic.
   *
   * @private
   * @property _timerConfiguration
   */
		this._timerConfiguration = null;

		/**
   * Defined max storage size.
   *
   * @const
   * @property MAX_STORAGE_SIZE
   * @type {number}
   */
		this.MAX_STORAGE_SIZE = 25;

		/**
   * Defined interval for attempt to configuration analytic.
   *
   * @protected
   * @property INTERVAL_FOR_ATTEMPT_CONFIGURATION
   * @type {number}
   */
		this.INTERVAL_FOR_ATTEMPT_CONFIGURATION = 25;

		/**
   * Module prefix id for loading analytic script to page.
   *
   * @protected
   * @property PREFIX_ID
   * @type {string}
   */
		this.PREFIX_ID = 'ModuleIMAjsAnalytic';
	}

	/**
  * Initialization analytic.
  *
  * @method init
  */

	Abstract.prototype.init = function init() {
		this._install();
		this._configuration();

		if (!this.isEnabled() && this._window.isClient()) {
			this._deferAttemptToConfiguration();
		}
	};

	/**
  * Returns template for loading script async.
  *
  * @method getTemplate
  * @param {string} url
  * @param {string} id
  * @return {string}
  */

	Abstract.prototype.getTemplate = function getTemplate(url, id) {
		var template = '(function(win,doc,tag,url,id){' + 'var script = doc.createElement(tag);' + 'var firstScript = doc.getElementsByTagName(tag)[0];' + 'script.async = 1;' + 'script.src = url;' + 'firstScript.parentNode.insertBefore(script, firstScript);' + ('})(window,document,\'script\',\'' + url + '\', \'' + id + '\')');

		return template;
	};

	/**
  * Returns true if analytic is enabled.
  *
  * @method isEnabled
  * @return {boolean}
  */

	Abstract.prototype.isEnabled = function isEnabled() {
		return this._enable;
	};

	/**
  * Hit event to analytic with defined data. If analytic is not configured then
  * defer hit to storage.
  *
  * @method hit
  * @param {Object<string, *>} data
  */

	Abstract.prototype.hit = function hit(data) {
		throw new Error('The hit() method is abstract and must be ' + 'overridden.');
	};

	/**
  * Hit page view event to analytic for defined page data.
  *
  * @method hitPageView
  * @param {Object<string, *>} pageData
  */

	Abstract.prototype.hitPageView = function hitPageView(pageData) {
		throw new Error('The hitPageView() method is abstract and must be ' + 'overridden.');
	};

	/**
  * Load analytic script to page.
  *
  * @protected
  * @method install
  * @param {string} url
  * @param {string} id
  */

	Abstract.prototype._install = function _install(url, id) {
		if (this._window.isClient()) {
			var scriptId = this.PREFIX_ID + id;
			var script = this._window.getElementById(scriptId);

			if (!script) {
				script = document.createElement('script');
				script.setAttribute('id', scriptId);

				script.innerHTML = this.getTemplate(url, id);

				var firstScript = this._window.querySelectorAll('script')[0];
				firstScript.parentNode.insertBefore(script, firstScript);
			}
		}
	};

	/**
  * Defer hit so that save data to storage for re-hit after analytic is configured.
  *
  * @protected
  * @method _deferHit
  * @param {Object<string, *>} data
  */

	Abstract.prototype._deferHit = function _deferHit(data) {
		if (this._storageOfHits.length <= this.MAX_STORAGE_SIZE) {
			this._storageOfHits.push(data);
		}
	};

	/**
  * Configuration DOT analyst
  *
  * @protected
  * @method _configuration
  */

	Abstract.prototype._configuration = function _configuration() {
		throw new Error('The _configuration() method is abstract and must be ' + 'overridden.');
	};

	/**
  * Flush storage and re-hit data to analytic.
  *
  * @protected
  * @method _flushStorage
  */

	Abstract.prototype._flushStorage = function _flushStorage() {
		for (var _iterator = this._storageOfHits, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var data = _ref;

			this.hit(data);
		}

		this._storageOfHits = [];
	};

	/**
  * Set new timeout for attempt configuration analytic.
  *
  * @protected
  * @method _deferAttemptToConfiguration
  */

	Abstract.prototype._deferAttemptToConfiguration = function _deferAttemptToConfiguration() {
		var _this = this;

		clearTimeout(this._timerConfiguration);

		this._timerConfiguration = setTimeout(function () {
			_this._configuration();

			if (_this.isEnabled()) {
				_this._flushStorage();
			} else {
				_this._deferAttemptToConfiguration();
			}
		}, this.INTERVAL_FOR_ATTEMPT_CONFIGURATION);
	};

	return Abstract;
})();

exports['default'] = Abstract;
module.exports = exports['default'];