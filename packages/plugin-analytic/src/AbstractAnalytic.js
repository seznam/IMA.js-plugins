/**
 * Abstract analytic class
 */
export default class AbstractAnalytic {
  /**
   * @param {ima.plugin.script.loader.ScriptLoaderPlugin} scriptLoader
   * @param {ima.window.Window} window
   * @param {ima.event.Dispatcher} dispatcher
   * @param {Object<string, *>} config
   */
  constructor(scriptLoader, window, dispatcher, config) {
    /**
     * Handler from ima-plugin-script-loader.
     *
     * @protected
     * @type {ima.plugin.script.loader.ScriptLoaderPlugin}
     */
    this._scriptLoader = scriptLoader;

    /**
     * IMA.js Window
     *
     * @protected
     * @type {ima.window.Window}
     */
    this._window = window;

    /**
     * IMA.js Dispatcher
     *
     * @protected
     * @type {ima.event.Dispatcher}
     */
    this._dispatcher = dispatcher;

    /**
     * Analytic config
     *
     * @protected
     * @type {(Object<string, *>)}
     */
    this._config = config;

    /**
     * Analytic script url.
     *
     * @protected
     * @type {?string}
     */
    this._analyticScriptUrl = null;

    /**
     * If flag has value true then analytic is enable for hit events.
     *
     * @protected
     * @type {boolean}
     */
    this._enable = false;

    /**
     * Array of callbacks the
     *
     * @protected
     * @type {Array<{ callback: Function }>}
     */
    this._deferredHits = [];

    /**
     * The maximum number of deferred hits stored in the pending hits
     * storage.
     *
     * @type {number}
     */
    this.MAX_DEFERRED_HITS_SIZE = 30;
  }

  /**
   * Initialization analytic.
   *
   * @method init
   */
  init() {
    if (!this.isEnabled() && this._window.isClient()) {
      const clientWindow = this._window.getWindow();
      this.createGlobalDefinition(clientWindow);
    }
  }

  /**
   * Load analytic script, configure analytic and execute deferred hits.
   */
  load() {
    if (
      !this.isEnabled() &&
      this._window.isClient() &&
      this._analyticScriptUrl
    ) {
      return this._scriptLoader
        .load(this._analyticScriptUrl)
        .then(() => {
          this._configuration();
          this._executeDeferredHits();

          return true;
        })
        .catch(error => {
          console.error(error);
        });
    }

    return Promise.resolve(false);
  }

  /**
   * Creates global definition for analytics script.
   *
   * @abstract
   * @param {window} window Global window object on client
   * @returns {void}
   */
  createGlobalDefinition() {}

  /**
   * Executes hit callback or stores it for later execution
   * if analytic is not enabled yet.
   *
   * @param {Function} callback
   * @returns {void}
   */
  deferHitAfterLoad(callback) {
    if (this.isEnabled()) {
      callback();
    } else if (this._deferredHits.length <= this.MAX_DEFERRED_HITS_SIZE) {
      this._deferredHits.push({ callback });
    }
  }

  /**
   * Returns true if analytic is enabled.
   *
   * @return {boolean}
   */
  isEnabled() {
    return this._enable;
  }

  /**
   * Hit event to analytic with defined data. If analytic is not configured then
   * defer hit to storage.
   *
   * @abstract
   * @param {Object<string, *>} data
   */
  hit() {
    throw new Error('The hit() method is abstract and must be overridden.');
  }

  /**
   * Hit page view event to analytic for defined page data.
   *
   * @abstract
   * @param {Object<string, *>} pageData
   */
  hitPageView() {
    throw new Error(
      'The hitPageView() method is abstract and must be overridden.'
    );
  }

  /**
   * Configuration analytic
   *
   * @abstract
   * @protected
   */
  _configuration() {
    throw new Error(
      'The _configuration() method is abstract and must be overridden.'
    );
  }

  /**
   * Execute stored hits
   *
   * @protected
   * @returns {void}
   */
  _executeDeferredHits() {
    for (const { callback } of this._deferredHits) {
      callback();
    }

    this._deferredHits.length = 0;
  }
}
