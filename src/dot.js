import Abstract from './abstract.js';

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
export default class Dot extends Abstract {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Window} window
	 */
	constructor(window) {
		super(window);
	}

	/**
	 * Returns data-dot-data structure for element from defined params.
	 *
	 * @method getDotDataForElement
	 * @param {Object<string, string|number|boolean>} params
	 * @return {string}
	 */
	getDOTDataForElement(params) {
		var dotPairs = [];

		for (let key of Object.keys(params)) {
			let value = params[key];

			dotPairs.push(`"${key}":"${value}"`);
		}

		return `{${dotPairs.join(',')}}`;
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
			this._window.getWindow().DOT.hit('event', data);
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
		let data = {
			action: 'impress',
			page: pageData.route.getName(),
			params: pageData.params
		};

		this.hit(data);
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
			!this._window.getWindow().DOT ||
			!this._serviceId ||
			this._enable) {
			return;
		}

		this._enable = true;
		this._window.getWindow().DOT.cfg({ service: this._serviceId });
	}
}
