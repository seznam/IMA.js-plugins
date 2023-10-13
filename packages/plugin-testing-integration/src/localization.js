import path from 'path';

import { assignRecursively } from '@ima/helpers';
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

      dictionaries[filename] = assignRecursively(
        dictionaries[filename] ?? {},
        _deepMapValues(dictJson, mf.compile.bind(mf))
      );
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
 * @param {object | Array} obj object to be manipulated
 * @param {Function} fn function to run on values
 * @returns {object | Array}
 */
function _deepMapValues(obj, fn) {
  if (Array.isArray(obj)) {
    return obj.map(val => _deepMapValues(val, fn));
  } else if (typeof obj === 'function') {
    // Skip already mapped values
    return obj;
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, current) => {
      acc[current] = _deepMapValues(obj[current], fn);
      return acc;
    }, {});
  } else {
    return fn(obj);
  }
}

export { generateDictionary };
