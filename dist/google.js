'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _abstractJs = require('./abstract.js');

var _abstractJs2 = _interopRequireDefault(_abstractJs);

/**
 * Google
 *
 * @class Google
 * @namespace Seznam.Analytic
 * @module Seznam
 * @submodule Sezna.Analytic
 *
 * @extends Seznam.Analytic.Abstract
 */

var Google = (function (_Abstract) {
	_inherits(Google, _Abstract);

	/**
  * @method constructor
  * @constructor
  * @param {Core.Interface.Window} window
  */

	function Google(window) {
		_classCallCheck(this, Google);

		_Abstract.call(this, window);
	}

	/**
  * Hit event to analytic with defined data. If analytic is not configured then
  * defer hit to storage.
  *
  * @override
  * @method hit
  * @param {Object<string, *>} data
  */

	Google.prototype.hit = function hit(data) {
		if (this._enable) {
			this._window.getWindow().ga('send', 'event', data.category || 'undefined', data.action || 'undefined', data.label, data.value, data.fields);
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

	Google.prototype.hitPageView = function hitPageView(pageData) {
		if (this._enable) {
			this._window.getWindow().ga('set', 'page', pageData.path);
			this._window.getWindow().ga('send', 'pageview');
		}
	};

	/**
  * Configuration DOT analyst
  *
  * @override
  * @protected
  * @method _setConfiguration
  */

	Google.prototype._configurationAnalyst = function _configurationAnalyst() {
		if (!this._window.isClient() || !this._window.getWindow().ga || typeof this._window.getWindow().ga !== 'function' || this._enable) {
			return;
		}

		this._enable = true;
	};

	return Google;
})(_abstractJs2['default']);

exports['default'] = Google;
module.exports = exports['default'];