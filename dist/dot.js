'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _abstractJs = require('./abstract.js');

var _abstractJs2 = _interopRequireDefault(_abstractJs);

/**
 * Dot
 *
 * @class Dot
 * @namespace Seznam.Analytic
 * @module Seznam
 * @submodule Seznam.Analytic
 *
 * @extends Seznam.Analytic.Abstract
 */

var Dot = (function (_Abstract) {
	_inherits(Dot, _Abstract);

	/**
  * @method constructor
  * @constructor
  * @param {Core.Interface.Window} window
  */

	function Dot(window) {
		_classCallCheck(this, Dot);

		_Abstract.call(this, window);
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
		if (this._enable) {
			this._window.getWindow().DOT.hit('event', data);
		} else {
			this._configurationAnalyst();
			this._deferHit(data);
			this._deferAttemptToFlushStorage();
		}
	};

	/**
  * Hit page view event to analytic witd defined data.
  *
  * @method hitPageView
  * @param {Object<string, *>} pageData
  */

	Dot.prototype.hitPageView = function hitPageView(pageData) {
		var data = {
			action: 'impress',
			page: pageData.route.getName(),
			params: pageData.params
		};

		this.hit(data);
	};

	/**
  * Configuration DOT analyst
  *
  * @override
  * @protected
  * @method _setConfiguration
  */

	Dot.prototype._configurationAnalyst = function _configurationAnalyst() {
		if (!this._window.isClient() || !this._window.getWindow().DOT || !this._serviceId || this._enable) {
			return;
		}

		this._enable = true;
		this._window.getWindow().DOT.cfg({ service: this._serviceId });
	};

	return Dot;
})(_abstractJs2['default']);

exports['default'] = Dot;
module.exports = exports['default'];