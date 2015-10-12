import Abstract from './abstract.js';

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
export default class Google extends Abstract {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Window} window
	 */
	constructor(window) {
		super(window);
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
		if (this._enable) {
			this._window.getWindow().ga('send', 'event', data.category || 'undefined', data.action || 'undefined', data.label, data.value, data.fields);
		} else {
			this._configurationAnalyst();
			this._deferHit(data);
			this._deferAttemptToFlushStorage();
		}
	}

	/**
	 * Hit page view event to analytic witd defined data.
	 *
	 * @method hitPageView
	 * @param {Object<string, *>} pageData
	 */
	hitPageView(pageData) {
		if (this._enable) {
			this._window.getWindow().ga('set', 'page', pageData.path);
			this._window.getWindow().ga('send', 'pageview');
		}
	}

	/**
	 * Configuration DOT analyst
	 *
	 * @override
	 * @protected
	 * @method _setConfiguration
	 */
	_configurationAnalyst() {
		if (!this._window.isClient() ||
			!this._window.getWindow().ga ||
			typeof this._window.getWindow().ga !== 'function' ||
			this._enable) {
			return;
		}

		this._enable = true;
	}

}
