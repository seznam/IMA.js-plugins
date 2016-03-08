import { AbstractAnalytic } from 'ima-plugin-analytic';

/**
 * Google analytic class
 *
 * @class GoogleAnalytic
 * @namespace ima.plugin.analytic.google
 * @module ima
 * @submodule ima.plugin
 *
 * @extends ima.plugin.analytic.AbstractAnalytic
 */
export default class GoogleAnalytic extends AbstractAnalytic {

	/**
	 * @method constructor
	 * @constructor
	 * @param {ima.plugin.script.loader.ScriptLoaderPlugin} scriptLoader
	 * @param {ima.window.Window} window
	 * @param {ima.event.Dispatcher} dispatcher
	 * @param {Object<string, string>} Events
	 * @param {Object<string, *>} config
	 */
	constructor(scriptLoader, window, dispatcher, Events, config) {
		super(scriptLoader, window, dispatcher, Events, config);

		this._analyticScriptUrl = '//www.google-analytics.com/analytics.js';
	}

	/**
	 * Initialization analytic.
	 *
	 * @method init
	 */
	init() {
		super.init();

		this._configuration();
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
				`win[id] = win[id] || function() {` +
				`win[id].q = win[id].q || [];` +
				`win[id].q.push(arguments);` +
				`};` +
				`win[id].l = 1*new Date();` +
				`var script = doc.createElement(tag);` +
				`var firstScript = doc.getElementsByTagName(tag)[0];` +
				`script.async = 1;` +
				`script.src = url;` +
				`firstScript.parentNode.insertBefore(script, firstScript);` +
				`})(window,document,'script','${this._analyticScriptUrl}', 'ga')`;

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
		if (!this._window.isClient() ||
				!this._window.getWindow().ga ||
				typeof this._window.getWindow().ga !== 'function' ||
				this.isEnabled()) {
			return;
		}

		this._enable = true;
		this._window.getWindow().ga('create', this._config.service, 'auto', this._config.settings);
		this._dispatcher.fire(this._Events.LOADED, { type: 'google' }, true);
	}
}
