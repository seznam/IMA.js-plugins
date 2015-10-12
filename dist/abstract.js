/**
 * Abstract analytic class.
 *
 * @class Abstract
 * @namespace Seznam.Analytic
 * @module Seznam
 * @submodule Seznam.Analytic
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Abstract = (function () {

	/**
  * @method constructor
  * @constructor
  * @param {Core.Interface.Window} window
  */

	function Abstract(window) {
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
   * Service id.
   *
   * @protected
   * @property _serviceId
   * @type {(string|null)}
   */
		this._serviceId = null;

		/**
   * Storage where we store hits for unprepared analytic.
   *
   * @protected
   * @property _storage
   * @type {Array<Object<string, *>>}
   */
		this._storage = [];

		/**
   * If flag has value true then analytic is enable for hit events.
   *
   * @protected
   * @property _enable
   * @type {boolean}
   */
		this._enable = false;

		/**
   * Defined max storage size.
   *
   * @const
   * @property MAX_STORAGE_SIZE
   * @type {number}
   */
		this.MAX_STORAGE_SIZE = 20;

		/**
   * Defined interval for attempt to flush storage.
   *
   * @protected
   * @property INTERVAL_FOR_ATTEMPT_FLUSH_STORAGE
   * @type {number}
   */
		this.INTERVAL_FOR_ATTEMPT_FLUSH_STORAGE = 2500;
	}

	/**
  * Initialization analytic.
  *
  * @method init
  * @param {string} serviceId
  */

	Abstract.prototype.init = function init(serviceId) {
		this._serviceId = serviceId;

		this._configurationAnalyst();
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
  * Defer hit so that save data to storage for re-hit after analytic is configured.
  *
  * @protected
  * @method _deferHit
  * @param {Object<string, *>} data
  */

	Abstract.prototype._deferHit = function _deferHit(data) {
		if (this._storage.length <= this.MAX_STORAGE_SIZE) {
			this._storage.push(data);
		}
	};

	/**
  * Configuration DOT analyst
  *
  * @protected
  * @method _setConfiguration
  */

	Abstract.prototype._configurationAnalyst = function _configurationAnalyst() {
		throw new Error('The _configurationAnalyst() method is abstract and must be ' + 'overridden.');
	};

	/**
  * Flush storage and re-hit data to analytic.
  *
  * @protected
  * @method _flushStorage
  */

	Abstract.prototype._flushStorage = function _flushStorage() {
		for (var _iterator = this._storage, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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

		this._storage = [];
	};

	/**
  * Set new timeout for attempt re-hit data and flush storage.
  *
  * @protected
  * @method _deferAttemptToFlushStorage
  */

	Abstract.prototype._deferAttemptToFlushStorage = function _deferAttemptToFlushStorage() {
		var _this = this;

		clearTimeout(this._timer);

		this._timer = setTimeout(function () {
			_this._configurationAnalyst();

			if (_this.isEnabled()) {
				_this._flushStorage();
			} else {
				_this._deferAttemptToFlushStorage();
			}
		}, this.INTERVAL_FOR_ATTEMPT_FLUSH_STORAGE);
	};

	return Abstract;
})();

exports['default'] = Abstract;
module.exports = exports['default'];