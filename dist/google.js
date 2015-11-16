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
 * @namespace Module.Analytic
 * @module Module
 * @submodule Module.Analytic
 *
 * @extends Module.Analytic.Abstract
 */

var Google = (function (_Abstract) {
	_inherits(Google, _Abstract);

	/**
  * @method constructor
  * @constructor
  * @param {Core.Interface.Window} window
  * @param {Core.Interface.Dispatcher} dispatcher
  * @param {Object<string, string>} EVENTS
  * @param {Object<string, *>} config
  */

	function Google(window, dispatcher, EVENTS, config) {
		_classCallCheck(this, Google);

		_Abstract.call(this, window, dispatcher, EVENTS, config);
	}

	/**
  * Returns template for loading script async.
  *
  * @method getTemplate
  * @param {string} url
  * @param {string} id
  * @return {string}
  */

	Google.prototype.getTemplate = function getTemplate(url, id) {
		var template = '(function(win,doc,tag,url,id){' + 'win[id] = win[id] || function() {' + 'win[id].q = win[id].q || [];' + 'win[id].q.push(arguments);' + '};' + 'win[id].l = 1*new Date();' + 'var script = doc.createElement(tag);' + 'var firstScript = doc.getElementsByTagName(tag)[0];' + 'script.async = 1;' + 'script.src = url;' + 'firstScript.parentNode.insertBefore(script, firstScript);' + ('})(window,document,\'script\',\'' + url + '\', \'' + id + '\')');

		return template;
	};

	/**
  * Hit event to analytic with defined data. If analytic is not configured then
  * defer hit to storage.
  *
  * @override
  * @method hit
  * @param {Object<string, *>} data
  */

	Google.prototype.hit = function hit(data) {
		if (this.isEnabled()) {
			this._window.getWindow().ga(data.method || 'send', data.type || 'event', data.category || 'undefined', data.action || 'undefined', data.label, data.value, data.fields);
		}
	};

	/**
  * Hit page view event to analytic witd defined data.
  *
  * @method hitPageView
  * @param {Object<string, *>} pageData
  */

	Google.prototype.hitPageView = function hitPageView(pageData) {
		if (this.isEnabled()) {
			this._window.getWindow().ga('set', 'page', pageData.path);
			this._window.getWindow().ga('send', 'pageview');
		}
	};

	/**
  * Install analytic script to page.
  *
  * @method _install
  * @param {string} [url='//www.google-analytics.com/analytics.js']
  * @param {string} [id='ga']
  */

	Google.prototype._install = function _install() {
		var url = arguments.length <= 0 || arguments[0] === undefined ? '//www.google-analytics.com/analytics.js' : arguments[0];
		var id = arguments.length <= 1 || arguments[1] === undefined ? 'ga' : arguments[1];

		_Abstract.prototype._install.call(this, url, id);

		this._window.getWindow().ga('create', this._config.service, 'auto');
	};

	/**
  * Configuration DOT analyst
  *
  * @override
  * @protected
  * @method _configuration
  */

	Google.prototype._configuration = function _configuration() {
		if (!this._window.isClient() || !this._window.getWindow().ga || typeof this._window.getWindow().ga !== 'function' || this.isEnabled()) {
			return;
		}

		this._enable = true;
		this._dispatcher.fire(this._EVENTS.LOADED, { type: 'google' }, true);
	};

	return Google;
})(_abstractJs2['default']);

exports['default'] = Google;
module.exports = exports['default'];