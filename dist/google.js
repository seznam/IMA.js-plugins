'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _abstract = require('./abstract.js');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
class Google extends _abstract2.default {

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
		super(scriptLoader, window, dispatcher, EVENTS, config);

		this._analyticScriptUrl = '//www.google-analytics.com/analytics.js';
	}

	/**
  * Returns template for loading script async.
  *
  * @override
  * @method getTemplate
  * @return {string?}
  */
	getTemplate() {
		var template = `(function(win,doc,tag,url,id){` + `win[id] = win[id] || function() {` + `win[id].q = win[id].q || [];` + `win[id].q.push(arguments);` + `};` + `win[id].l = 1*new Date();` + `var script = doc.createElement(tag);` + `var firstScript = doc.getElementsByTagName(tag)[0];` + `script.async = 1;` + `script.src = url;` + `firstScript.parentNode.insertBefore(script, firstScript);` + `})(window,document,'script','${ this._analyticScriptUrl }', 'ga')`;

		return template;
	}

	/**
  * Hit event to analytic with defined data. If analytic is not configured then
  * defer hit to storage.
  *
  * @override
  * @method hit
  * @param {{method: string=, type: string=, category: string=, action: string=,
  *        label: string=, value: number, fields: Object<string, *>}} data
  *        The key of data are defined in documentation of google analytic.
  */
	hit(data) {
		if (this.isEnabled()) {
			this._window.getWindow().ga(data.method || 'send', data.type || 'event', data.category || 'undefined', data.action || 'undefined', data.label, data.value, data.fields);
		}
	}

	/**
  * Hit page view event to analytic witd defined data.
  *
  * @override
  * @method hitPageView
  * @param {Object<string, *>} pageData
  */
	hitPageView(pageData) {
		if (this.isEnabled()) {
			this._window.getWindow().ga('set', 'page', pageData.path);
			this._window.getWindow().ga('set', 'location', this._window.getUrl());
			this._window.getWindow().ga('set', 'title', document.title || '');
			this._window.getWindow().ga('send', 'pageview');
		}
	}

	/**
  * Configuration Google analytic
  *
  * @override
  * @protected
  * @method _configuration
  */
	_configuration() {
		if (!this._window.isClient() || !this._window.getWindow().ga || typeof this._window.getWindow().ga !== 'function' || this.isEnabled()) {
			return;
		}

		this._enable = true;
		this._window.getWindow().ga('create', this._config.service, 'auto', this._config.settings);
		this._dispatcher.fire(this._EVENTS.LOADED, { type: 'google' }, true);
	}
}
exports.default = Google;