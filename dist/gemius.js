'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _abstractJs = require('./abstract.js');

var _abstractJs2 = _interopRequireDefault(_abstractJs);

/**
 * Gemius
 *
 * @class Gemius
 * @namespace Module.Analytic
 * @module Seznma
 * @submodule Module.Analytic
 *
 * @extends Module.Analytic.Abstract
 */

var Gemius = (function (_Abstract) {
	_inherits(Gemius, _Abstract);

	/**
  * @method constructor
  * @constructor
  * @param {Core.Interface.Window} window
  * @param {Core.Interface.Dispatcher} dispatcher
  * @param {Object<string, string>} EVENTS
  * @param {Object<string, *>} config
  */

	function Gemius(window, dispatcher, EVENTS, config) {
		_classCallCheck(this, Gemius);

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

	Gemius.prototype.getTemplate = function getTemplate(url, id) {
		var template = '(function(win,doc,tag,url,id){' + 'function gemiusPending(name) {' + 'win[name] = win[name] || function() {' + 'win[name + \'_pdata\'] = win[name + \'_pdata\'] || [];' + 'win[name + \'_pdata\'].push(arguments);' + '};}' + 'gemiusPending(id + \'_hit\'); ' + 'gemiusPending(id + \'_event\'); ' + 'gemiusPending(\'pp_\' + id + \'_hit\'); ' + 'gemiusPending(\'pp_\' + id + \'_event\'); ' + 'var script = doc.createElement(tag);' + 'var firstScript = doc.getElementsByTagName(tag)[0];' + 'script.async = 1;' + 'script.src = url;' + 'firstScript.parentNode.insertBefore(script, firstScript);' + ('})(window,document,\'script\',\'' + url + '\', \'' + id + '\')');

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

	Gemius.prototype.hit = function hit(data) {
		if (this.isEnabled()) {
			var identifier = data.identifier;

			if (identifier) {

				if (data.parameters) {
					var parameters = Array.isArray(data.parameters) ? data.parameters : [data.parameters];

					this._window.getWindow().pp_gemius_event(identifier, parameters);
				} else {
					this._window.getWindow().pp_gemius_hit(identifier);
				}
			} else {
				console.warn('App.Service.Analytic:hit accept as argument object with {identifier, parameters=}. Your identifier is undefined.');
			}
		}
	};

	/**
  * Hit page view event to analytic witd defined data.
  *
  * @method hitPageView
  * @param {Object<string, *>} pageData
  */

	Gemius.prototype.hitPageView = function hitPageView(pageData) {
		if (this.isEnabled()) {
			var routeName = pageData.route.getName();
			var data = this._config.routes[routeName];

			if (data) {
				this.hit(data);
			} else {
				console.warn('App.Service.Analytic:hitPageView don\'t find route name for gemius config routes. Define route name "' + routeName + '" to your settings.js.');
			}
		}
	};

	/**
  * Install analytic script to page.
  *
  * @method _install
  * @param {string} [url='//gacz.hit.gemius.pl/xgemius.js']
  * @param {string} [id='ga']
  */

	Gemius.prototype._install = function _install() {
		var url = arguments.length <= 0 || arguments[0] === undefined ? '//gacz.hit.gemius.pl/xgemius.js' : arguments[0];
		var id = arguments.length <= 1 || arguments[1] === undefined ? 'gemius' : arguments[1];

		_Abstract.prototype._install.call(this, url, id);
	};

	/**
  * Configuration DOT analyst
  *
  * @override
  * @protected
  * @method _configuration
  */

	Gemius.prototype._configuration = function _configuration() {
		if (!this._window.isClient() || !this._window.getWindow().pp_gemius_hit || !this._window.getWindow().pp_gemius_event || typeof this._window.getWindow().pp_gemius_hit !== 'function' || typeof this._window.getWindow().pp_gemius_event !== 'function' || this.isEnabled()) {
			return;
		}

		this._enable = true;
		this._dispatcher.fire(this._EVENTS.LOADED, { type: 'gemius' }, true);
	};

	return Gemius;
})(_abstractJs2['default']);

exports['default'] = Gemius;
module.exports = exports['default'];