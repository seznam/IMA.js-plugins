import Abstract from './abstract.js';

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
export default class Gemius extends Abstract {

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

		this._analyticScriptUrl = '//gacz.hit.gemius.pl/xgemius.js';
	}

	/**
	 * Returns template for loading script async.
	 *
	 * @override
	 * @method getTemplate
	 * @return {string?}
	 */
	getTemplate() {
		var template = `(function(win,doc,tag,url,id){` +
				`function gemiusPending(name) {` +
				`win[name] = win[name] || function() {` +
				`win[name + '_pdata'] = win[name + '_pdata'] || [];` +
				`win[name + '_pdata'].push(arguments);` +
				`};}` +
				`gemiusPending(id + '_hit'); ` +
				`gemiusPending(id + '_event'); ` +
				`gemiusPending('pp_' + id + '_hit'); ` +
				`gemiusPending('pp_' + id + '_event'); ` +
				`var script = doc.createElement(tag);` +
				`var firstScript = doc.getElementsByTagName(tag)[0];` +
				`script.async = 1;` +
				`script.src = url;` +
				`firstScript.parentNode.insertBefore(script, firstScript);` +
				`})(window,document,'script','${this._analyticScriptUrl}', 'gemius')`;

		return template;
	}

	/**
	 * Hit event to analytic with defined data. If analytic is not configured then
	 * defer hit to storage.
	 *
	 * @override
	 * @method hit
	 * @param {Object<string, *>} data
	 */
	hit(data) {
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
			var routeName = pageData.route.getName();
			var data = this._config.routes[routeName];

			if (data) {
				this.hit(data);
			} else {
				console.warn(`App.Service.Analytic:hitPageView don't find route name for gemius config routes. Define route name "${routeName}" to your settings.js.`);
			}

		}
	}

	/**
	 * Configuration gemius analytic
	 *
	 * @override
	 * @protected
	 * @method _configuration
	 */
	_configuration() {
		if (!this._window.isClient() ||
				!this._window.getWindow().pp_gemius_hit ||
				!this._window.getWindow().pp_gemius_event ||
				typeof this._window.getWindow().pp_gemius_hit !== 'function' ||
				typeof this._window.getWindow().pp_gemius_event !== 'function' ||
				this.isEnabled()) {
			return;
		}

		this._enable = true;
		this._dispatcher.fire(this._EVENTS.LOADED, { type: 'gemius' }, true);
	}
}
