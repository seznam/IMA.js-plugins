import { defaultCssClasses } from '@ima/react-page-renderer';
import type { Argument } from 'classnames';
import classnames from 'classnames';
import { Component } from 'react';

import { numberToCssClass } from './postCssPlugin/numberToCssClass';

export type HashTable = [string[], string[]];
export type ReactComponentArgument = {
  props: {
    className: string;
  };
};

/**
 * CssClasses processor factory function.
 *
 * @param hashTable
 */
function scramblerFactory(hashTable: HashTable) {
  const prefixTable = new Map<string, string>();
  const mainPartTable = new Map<string, string>();
  const [prefixes, mainParts] = hashTable;

  for (let i = 0; i < prefixes.length; i++) {
    prefixTable.set(prefixes[i]!, numberToCssClass(i));
  }

  for (let i = 0; i < mainParts.length; i++) {
    mainPartTable.set(mainParts[i]!, numberToCssClass(i));
  }

  return (...args: Argument[]) => {
    for (let i = 0; i < args.length; i++) {
      if (args[i] instanceof Component) {
        args[i] = ((args[i] as ReactComponentArgument).props || {})?.className;
      }
    }

    const classNamesSource = classnames(...args);
    const processedClasses = classNamesSource
      .split(/\s+/)
      .map(className => {
        const parts = className.split('-');
        const prefix = parts[0]!;
        const mainPart = parts.slice(1).join('-');

        if (!prefixTable.has(prefix) || !mainPartTable.has(mainPart)) {
          return className;
        }

        return `${prefixTable.get(prefix)}_${mainPartTable.get(mainPart)}`;
      })
      .join(' ');

    return {
      className: processedClasses,
      'data-class': classNamesSource,
    };
  };
}

/**
 * Custom $CssClassname implementation that enables the support
 * for scrambled classNames.
 *
 * @param hashTable
 * @example
 * // In bind.js
 * oc.bind('$CssClasses', ...scrambleCssClasses(hashTable));
 */
function scrambleCssClasses(hashTable?: HashTable) {
  if (!hashTable) {
    return function () {
      return defaultCssClasses;
    };
  }

  return function scrambleCssProcessor() {
    const processor = scramblerFactory(hashTable);

    // @ts-expect-error nontyped
    return (...args) => processor(...args).className;
  };
}

export { scrambleCssClasses };
