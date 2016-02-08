'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _abstract = require('./abstract.js');

var _abstract2 = babelHelpers.interopRequireDefault(_abstract);

/**
 * Dot
 *
 * @class Dot
 * @namespace Module.Analytic
 * @module Module
 * @submodule Module.Analytic
 *
 * @extends Module.Analytic.Abstract
 */

var Dot = (function (_Abstract) {
	babelHelpers.inherits(Dot, _Abstract);

	/**
  * @method constructor
  * @constructor
  * @param {Core.Interface.Window} window
  * @param {Core.Interface.Dispatcher} dispatcher
  * @param {Object<string, string>} EVENTS
  * @param {Object<string, *>} config
  */

	function Dot(window, dispatcher, EVENTS, config) {
		babelHelpers.classCallCheck(this, Dot);

		/**
   * Prefix for route param key, which help with collide name.
   *
   * @const
   * @property ROUTE_PARAM_PREFIX
   * @type {string}
   */

		var _this = babelHelpers.possibleConstructorReturn(this, _Abstract.call(this, window, dispatcher, EVENTS, config));

		_this.ROUTE_PARAM_PREFIX = 'routeParam';
		return _this;
	}

	/**
  * Returns data-dot-data structure for element from defined params.
  *
  * @method getDotDataForElement
  * @param {Object<string, string|number|boolean>} params
  * @return {string}
  */

	Dot.prototype.getDOTDataForElement = function getDOTDataForElement(params) {
		var dotPairs = [];

		for (var _iterator = Object.keys(params), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var key = _ref;

			var value = params[key];

			dotPairs.push('"' + key + '":"' + value + '"');
		}

		return '{' + dotPairs.join(',') + '}';
	};

	/**
  * Hit event to analytic with defined data. If analytic is not configured then
  * defer hit to storage.
  *
  * @override
  * @method hit
  * @param {Object<string, *>} data
  */

	Dot.prototype.hit = function hit(data) {
		if (this.isEnabled()) {
			this._window.getWindow().DOT.hit('event', { d: data });
		} else {
			this._deferHit(data);
		}
	};

	/**
  * Hit page view event to analytic with defined data.
  *
  * @method hitPageView
  * @param {Object<string, *>} pageData
  */

	Dot.prototype.hitPageView = function hitPageView(pageData) {
		var data = {
			action: 'impress',
			page: pageData.route.getName()
		};

		if (pageData.params) {
			for (var _iterator2 = Object.keys(pageData.params), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var routeParamKey = _ref2;

				var prefixedRouteParamKey = this.ROUTE_PARAM_PREFIX + routeParamKey[0].toUpperCase() + routeParamKey.slice(1);

				data[prefixedRouteParamKey] = pageData.params[routeParamKey];
			}
		}

		this.hit(data);
	};

	/**
  * Install analytic script to page.
  *
  * @method _install
  * @param {string} [url='//h.imedia.cz/js/dot-small.js']
  * @param {string} [id='dot']
  */

	Dot.prototype._install = function _install() {
		var url = arguments.length <= 0 || arguments[0] === undefined ? '//h.imedia.cz/js/dot-small.js' : arguments[0];
		var id = arguments.length <= 1 || arguments[1] === undefined ? 'DOT' : arguments[1];

		_Abstract.prototype._install.call(this, this._config.url || url, id);
	};

	/**
  * Configuration DOT analyst
  *
  * @override
  * @protected
  * @method _configuration
  */

	Dot.prototype._configuration = function _configuration() {
		if (!this._window.isClient() || !this._window.getWindow().DOT || !this._config.service || this.isEnabled()) {
			return;
		}

		this._enable = true;
		this._window.getWindow().DOT.cfg(Object.assign({}, this._config, { url: undefined }));
		this._dispatcher.fire(this._EVENTS.LOADED, { type: 'dot' }, true);
	};

	return Dot;
})(_abstract2.default);

exports.default = Dot;