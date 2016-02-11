'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _abstract = require('./abstract.js');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Dot
 *
 * @class Dot
 * @namespace Module.Analytic
 * @module Module
 * @submodule Module.Analytic
 *
 * @extends Module.Analytic.Abstract
 */
class Dot extends _abstract2.default {

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

		/**
   * Storage where we store hits for unprepared analytic.
   *
   * @protected
   * @property _storage
   * @type {Array<Object<string, *>>}
   */
		this._storageOfHits = [];

		/**
   * Defined max storage size.
   *
   * @const
   * @property MAX_STORAGE_SIZE
   * @type {number}
   */
		this.MAX_STORAGE_SIZE = 25;

		/**
   * Prefix for route param key, which help with collide name.
   *
   * @const
   * @property ROUTE_PARAM_PREFIX
   * @type {string}
   */
		this.ROUTE_PARAM_PREFIX = 'routeParam';
	}

	/**
  * Returns template for loading script.
  *
  * @override
  * @method getTemplate
  * @return {string?}
  */
	getTemplate() {
		return null;
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

			dotPairs.push(`"${ key }":"${ value }"`);
		}

		return `{${ dotPairs.join(',') }}`;
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
			this._window.getWindow().DOT.hit('event', { d: data });
		} else {
			this._deferHit(data);
		}
	}

	/**
  * Hit page view event to analytic with defined data.
  *
  * @method hitPageView
  * @param {Object<string, *>} pageData
  */
	hitPageView(pageData) {
		let data = {
			action: 'impress',
			page: pageData.route.getName()
		};

		if (pageData.params) {
			for (let routeParamKey of Object.keys(pageData.params)) {
				let prefixedRouteParamKey = this.ROUTE_PARAM_PREFIX + routeParamKey[0].toUpperCase() + routeParamKey.slice(1);

				data[prefixedRouteParamKey] = pageData.params[routeParamKey];
			}
		}

		this.hit(data);
	}

	/**
  * Configuration DOT analyst
  *
  * @override
  * @protected
  * @method _configuration
  */
	_configuration() {
		if (!this._window.isClient() || !this._window.getWindow().DOT || !this._config.service || this.isEnabled()) {
			return;
		}

		this._enable = true;
		this._window.getWindow().DOT.cfg(Object.assign({}, this._config, { url: undefined }));
		this._dispatcher.fire(this._EVENTS.LOADED, { type: 'dot' }, true);
		this._flushStorage();
	}

	/**
  * Defer hit so that save data to storage for re-hit after analytic is configured.
  *
  * @protected
  * @method _deferHit
  * @param {Object<string, *>} data
  */
	_deferHit(data) {
		if (this._storageOfHits.length <= this.MAX_STORAGE_SIZE) {
			this._storageOfHits.push(data);
		}
	}

	/**
  * Flush storage and re-hit data to analytic.
  *
  * @protected
  * @method _flushStorage
  */
	_flushStorage() {
		for (let data of this._storageOfHits) {
			this.hit(data);
		}

		this._storageOfHits = [];
	}
}
exports.default = Dot;