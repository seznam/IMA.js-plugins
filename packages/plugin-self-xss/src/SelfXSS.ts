import type { Dictionary } from '@ima/core';

export class SelfXSS {
  #dictionary: Dictionary;

  static get $dependencies() {
    return ['$Dictionary'];
  }

  static get DICTIONARY_TITLE_KEY() {
    return 'ima-plugin-self-xss.title';
  }

  static get DICTIONARY_PHASE_KEY() {
    return 'ima-plugin-self-xss.phase';
  }

  constructor(dictionary: Dictionary) {
    this.#dictionary = dictionary;
  }

  /**
   * The method print self XSS warning message to console.
   */
  init() {
    // @if client
    if (
      !this.#dictionary.has(SelfXSS.DICTIONARY_PHASE_KEY) ||
      !this.#dictionary.has(SelfXSS.DICTIONARY_TITLE_KEY)
    ) {
      if ($Debug) {
        throw new Error(
          `The dictionary hasn't keys: ${SelfXSS.DICTIONARY_TITLE_KEY} or ` +
            `${SelfXSS.DICTIONARY_PHASE_KEY}. You must add ` +
            `"./node_modules/@ima/plugin-self-xss/locales/*{language}.json" ` +
            `path to languages in your app/build.js file.`
        );
      }

      return;
    }

    // FIXME when types are fixed in ima
    console.log(
      `%c${this.#dictionary.get(SelfXSS.DICTIONARY_TITLE_KEY, {})}`,
      'font: bold 4em sans-serif; -webkit-text-stroke: 1px black; color: red;'
    );
    console.log(
      `%c${this.#dictionary.get(SelfXSS.DICTIONARY_PHASE_KEY, {})}`,
      'font: 2em sans-serif; color: gray;'
    );
    // @endif
  }
}
