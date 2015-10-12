/**
 * Abstract analytic class.
 *
 * @class Abstract
 * @namespace Seznam.Analytic
 * @module Seznam
 * @submodule Seznam.Analytic
 */
export default class Abstract {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Window} window
	 */
	constructor(window) {

		/**
		 * IMA.js Window
		 *
		 * @protected
		 * @property _window
		 * @type {Core.Interface.Window}
		 */
		this._window = window;

		/**
		 * Service id.
		 *
		 * @protected
		 * @property _serviceId
		 * @type {(string|null)}
		 */
		this._serviceId = null;

		/**
		 * Storage where we store hits for unprepared analytic.
		 *
		 * @protected
		 * @property _storage
		 * @type {Array<Object<string, *>>}
		 */
		this._storage = [];

		/**
		 * If flag has value true then analytic is enable for hit events.
		 *
		 * @protected
		 * @property _enable
		 * @type {boolean}
		 */
		this._enable = false;

		/**
		 * Defined max storage size.
		 *
		 * @const
		 * @property MAX_STORAGE_SIZE
		 * @type {number}
		 */
		this.MAX_STORAGE_SIZE = 20;

		/**
		 * Defined interval for attempt to flush storage.
		 *
		 * @protected
		 * @property INTERVAL_FOR_ATTEMPT_FLUSH_STORAGE
		 * @type {number}
		 */
		this.INTERVAL_FOR_ATTEMPT_FLUSH_STORAGE = 2500;
	}

	/**
	 * Initialization analytic.
	 *
	 * @method init
	 * @param {string} serviceId
	 */
	init(serviceId) {
		this._serviceId = serviceId;

		this._configurationAnalyst();
	}

	/**
	 * Returns true if analytic is enabled.
	 *
	 * @method isEnabled
	 * @return {boolean}
	 */
	isEnabled() {
		return this._enable;
	}

	/**
	 * Hit event to analytic with defined data. If analytic is not configured then
	 * defer hit to storage.
	 *
	 * @method hit
	 * @param {Object<string, *>} data
	 */
	hit(data) {
		throw new Error('The hit() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * Hit page view event to analytic for defined page data.
	 *
	 * @method hitPageView
	 * @param {Object<string, *>} pageData
	 */
	hitPageView(pageData) {
		throw new Error('The hitPageView() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * Defer hit so that save data to storage for re-hit after analytic is configured.
	 *
	 * @protected
	 * @method _deferHit
	 * @param {Object<string, *>} data
	 */
	_deferHit(data) {
		if (this._storage.length <= this.MAX_STORAGE_SIZE) {
			this._storage.push(data);
		}
	}

	/**
	 * Configuration DOT analyst
	 *
	 * @protected
	 * @method _setConfiguration
	 */
	_configurationAnalyst() {
		throw new Error('The _configurationAnalyst() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * Flush storage and re-hit data to analytic.
	 *
	 * @protected
	 * @method _flushStorage
	 */
	_flushStorage() {
		for(let data of this._storage) {
			this.hit(data);
		}

		this._storage = [];
	}

	/**
	 * Set new timeout for attempt re-hit data and flush storage.
	 *
	 * @protected
	 * @method _deferAttemptToFlushStorage
	 */
	_deferAttemptToFlushStorage() {
		clearTimeout(this._timer);

		this._timer = setTimeout(() => {
			this._configurationAnalyst();

			if (this.isEnabled()) {
				this._flushStorage();
			} else {
				this._deferAttemptToFlushStorage();
			}
		}, this.INTERVAL_FOR_ATTEMPT_FLUSH_STORAGE);
	}
}