import path from 'path';

import MessageFormat from '@messageformat/core';
import globby from 'globby';

import { requireFromProject } from './helpers';

/**
 * Generates IMA formatted dictionary
 *
 * @param {object} languages
 * @param {string} locale
 * @returns {object}
 */
function generateDictionary(languages, locale = 'en') {
  if (!languages) {
    return {};
  }
  const mf = new MessageFormat(locale);
  const dictionaries = {};
  const langFileGlobs = languages[locale];
  globby.sync(langFileGlobs).forEach(file => {
    try {
      const filename = path
        .basename(file)
        .replace(locale.toUpperCase() + path.extname(file), '');

      const dictJson = requireFromProject(file);

      dictionaries[filename] = _deepMapValues(dictJson, mf.compile.bind(mf));
    } catch (e) {
      console.error(
        `Tried to load dictionary JSON at path "${file}", but recieved following error.`
      );
      console.error(e);
    }
  });
  return dictionaries;
}

/**
 * Apply function through full object or array values
 *
 * @param {object|array} object to be manipulated
 * @param {function} function to run on values
 * @returns {object|array}
 */
function _deepMapValues(obj, fn) {
  if (Array.isArray(obj)) {
    return obj.map(val => _deepMapValues(val, fn));
  } else if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, current) => {
      const key = current;
      const val = obj[current];
      acc[key] =
          val !== null && typeof val === 'object' ? _deepMapValues(val, fn) : fn(val);
      return acc;
    }, {})
  } else {
    return fn(val);
  }
}

export { generateDictionary };
