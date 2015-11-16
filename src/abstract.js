/**
 * Abstract analytic class
 *
 * @class Abstract
 * @namespace Module.Analytic
 * @module Module
 * @submodule Module.Analytic
 */
export default class Abstract {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Window} window
	 * @param {Core.Interface.Dispatcher} dispatcher
	 * @param {Object<string, string>} EVENTS
	 * @param {Object<string, *>} config
	 */
	constructor(window, dispatcher, EVENTS, config) {

		/**
		 * IMA.js Window
		 *
		 * @protected
		 * @property _window
		 * @type {Core.Interface.Window}
		 */
		this._window = window;

		/**
		 * IMA.js Dispatcher
		 *
		 * @private
		 * @property _dispatcher
		 * @type {Core.Interface.Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * Analytic defined EVENTS.
		 *
		 * @const
		 * @property _EVENTS
		 * @type {Object<string, string>}
		 */
		this._EVENTS = EVENTS;

		/**
		 * Analytic config
		 *
		 * @protected
		 * @property _config
		 * @type {(Object<string, *>)}
		 */
		this._config = config;

		/**
		 * Storage where we store hits for unprepared analytic.
		 *
		 * @protected
		 * @property _storage
		 * @type {Array<Object<string, *>>}
		 */
		this._storageOfHits = [];

		/**
		 * If flag has value true then analytic is enable for hit events.
		 *
		 * @protected
		 * @property _enable
		 * @type {boolean}
		 */
		this._enable = false;

		/**
		 * Timer for trying flush storage.
		 *
		 * @private
		 * @property _timerFlushStorage
		 */
		this._timerFlushStorage = null;

		/**
		 * Timer for trying configuration analytic.
		 *
		 * @private
		 * @property _timerConfiguration
		 */
		this._timerConfiguration = null;

		/**
		 * Defined max storage size.
		 *
		 * @const
		 * @property MAX_STORAGE_SIZE
		 * @type {number}
		 */
		this.MAX_STORAGE_SIZE = 25;

		/**
		 * Defined interval for attempt to configuration analytic.
		 *
		 * @protected
		 * @property INTERVAL_FOR_ATTEMPT_CONFIGURATION
		 * @type {number}
		 */
		this.INTERVAL_FOR_ATTEMPT_CONFIGURATION = 25;

		/**
		 * Module prefix id for loading analytic script to page.
		 *
		 * @protected
		 * @property PREFIX_ID
		 * @type {string}
		 */
		this.PREFIX_ID = 'ModuleIMAjsAnalytic';

	}

	/**
	 * Initialization analytic.
	 *
	 * @method init
	 */
	init() {
		this._install();
		this._configuration();

		if (!this.isEnabled() && this._window.isClient()) {
			this._deferAttemptToConfiguration();
		}
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
				`var script = doc.createElement(tag);` +
				`var firstScript = doc.getElementsByTagName(tag)[0];` +
				`script.async = 1;` +
				`script.src = url;` +
				`firstScript.parentNode.insertBefore(script, firstScript);` +
				`})(window,document,'script','${url}', '${id}')`;

		return template;
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
	 * Load analytic script to page.
	 *
	 * @protected
	 * @method install
	 * @param {string} url
	 * @param {string} id
	 */
	_install(url, id) {
		if (this._window.isClient()) {
			var scriptId = this.PREFIX_ID + id;
			var script = this._window.getElementById(scriptId);

			if (!script) {
				script = document.createElement('script');
				script.setAttribute('id', scriptId);

				script.innerHTML = this.getTemplate(url, id);

				var firstScript = this._window.querySelectorAll('script')[0];
				firstScript.parentNode.insertBefore(script, firstScript);
			}
		}
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
	 * Configuration DOT analyst
	 *
	 * @protected
	 * @method _configuration
	 */
	_configuration() {
		throw new Error('The _configuration() method is abstract and must be ' +
				'overridden.');
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

	/**
	 * Set new timeout for attempt configuration analytic.
	 *
	 * @protected
	 * @method _deferAttemptToConfiguration
	 */
	_deferAttemptToConfiguration() {
		clearTimeout(this._timerConfiguration);

		this._timerConfiguration = setTimeout(() => {
			this._configuration();

			if (this.isEnabled()) {
				this._flushStorage();
			} else {
				this._deferAttemptToConfiguration();
			}
		}, this.INTERVAL_FOR_ATTEMPT_CONFIGURATION);
	}
}
