/**
 * Self XSS class
 */
export default class SelfXSS {
  static get $dependencies() {
    return ['$Window', '$Dictionary'];
  }

  static get DICTIONARY_TITLE_KEY() {
    return 'ima-plugin-self-xss.title';
  }

  static get DICTIONARY_PHASE_KEY() {
    return 'ima-plugin-self-xss.phase';
  }

  /**
   * @param {ima.window.Window} window
   * @param {ima.dictionary.Dictionary} dictionary
   */
  constructor(window, dictionary) {
    /**
     * @type {ima.window.Window}
     */
    this._window = window;

    /**
     * @type {ima.dictionary.Dictionary}
     */
    this._dictionary = dictionary;
  }

  /**
   * The method print self XSS warning message to console.
   */
  init() {
    let browserWindow = this._window.getWindow();
    let isConsoleAvailable = browserWindow && !!browserWindow.console;

    if (!this._window.isClient() || !isConsoleAvailable) {
      return;
    }

    if (
      !this._dictionary.has(SelfXSS.DICTIONARY_PHASE_KEY) ||
      !this._dictionary.has(SelfXSS.DICTIONARY_TITLE_KEY)
    ) {
      if ($Debug) {
        throw new Error(
          `The dictionary hasn't keys: ${SelfXSS.DICTIONARY_TITLE_KEY} or ` +
            `${SelfXSS.DICTIONARY_PHASE_KEY}. You must add ` +
            `"./node_modules/ima-plugin-self-xss/locales/*{language}.json" ` +
            `path to languages in your app/build.js file.`
        );
      }

      return;
    }

    /* eslint-disable no-console */
    console.log(
      `%c${this._dictionary.get(SelfXSS.DICTIONARY_TITLE_KEY)}`,
      'font: bold 4em sans-serif; -webkit-text-stroke: 1px black; color: red;'
    );
    console.log(
      `%c${this._dictionary.get(SelfXSS.DICTIONARY_PHASE_KEY)}`,
      'font: 2em sans-serif; color: gray;'
    );
    /* eslint-disable */
  }
}
