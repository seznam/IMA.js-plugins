import Abstract from './abstract.js';

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
export default class Google extends Abstract {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Window} window
	 * @param {Core.Interface.Dispatcher} dispatcher
	 * @param {Object<string, string>} EVENTS
	 * @param {Object<string, *>} config
	 */
	constructor(window, dispatcher, EVENTS, config) {
		super(window, dispatcher, EVENTS, config);
	}

	/**
	 * Returns template for loading script async.
	 *
	 * @method getTemplate
	 * @param {string} url
	 * @param {string} id
	 * @return {string}
	 */
	getTemplate(url, id) {
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
				`})(window,document,'script','${url}', '${id}')`;

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
			this._window.getWindow().ga('send', 'event', data.category || 'undefined', data.action || 'undefined', data.label, data.value, data.fields);
		}
	}

	/**
	 * Hit page view event to analytic witd defined data.
	 *
	 * @method hitPageView
	 * @param {Object<string, *>} pageData
	 */
	hitPageView(pageData) {
		if (this.isEnabled()) {
			this._window.getWindow().ga('set', 'page', pageData.path);
			this._window.getWindow().ga('send', 'pageview');
		}
	}

	/**
	 * Install analytic script to page.
	 *
	 * @method _install
	 * @param {string} [url='//www.google-analytics.com/analytics.js']
	 * @param {string} [id='ga']
	 */
	_install(url = '//www.google-analytics.com/analytics.js', id = 'ga') {
		super._install(url, id);

		this._window.getWindow().ga('create', this._config.service, 'auto');
	}

	/**
	 * Configuration DOT analyst
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
		this._dispatcher.fire(this._EVENTS.LOADED, { type: 'google' }, true);
	}
}
