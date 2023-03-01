// File numberToCssClass.js is being copied to the same directory as this file
// by ScrambleCssPlugin.webpack().
// eslint-disable-next-line import/no-unresolved
import { numberToCssClass } from './numberToCssClass.js';

(function () {
  'use strict';

  var hashTable = $IMA.$App.scrambleCss.hashTable;
  if (!hashTable) {
    console &&
      console.error(
        'Either the css classes were not scrambled, or the scrambling ' +
          'hashtable cannot be located (expected to find the hashtable ' +
          'available as $IMA.$App.scrambleCss.hashTable).'
      );
  }

  var decodeTables = loadHashTable(hashTable);
  var prefixDecodeTable = decodeTables[0];
  var mainPartDecodeTable = decodeTables[1];

  walkDom(
    document.body,
    decodeCssClasses.bind(null, prefixDecodeTable, mainPartDecodeTable)
  );

  function decodeCssClasses(prefixDecodeTable, mainPartDecodeTable, node) {
    var nodeClassName = node.className;
    if (nodeClassName && typeof nodeClassName === 'object') {
      // inline SVG
      nodeClassName = nodeClassName.baseVal;
    }
    if (!nodeClassName) {
      return;
    }

    var classNames = nodeClassName.split(/\s+/);
    var decodedClassNames = classNames
      .map(function (className) {
        if (!/^[^_]+_[^_]+$/.test(className)) {
          return className;
        }

        var parts = className.split('_');
        if (
          !prefixDecodeTable.has(parts[0]) ||
          !mainPartDecodeTable.has(parts[1])
        ) {
          return className;
        }

        return (
          prefixDecodeTable.get(parts[0]) +
          '-' +
          mainPartDecodeTable.get(parts[1])
        );
      })
      .join(' ');
    node.dataset.class = decodedClassNames;
  }

  function walkDom(node, callback) {
    callback(node);
    var child = node.firstElementChild;
    while (child) {
      walkDom(child, callback);
      child = child.nextElementSibling;
    }
  }

  function loadHashTable(hashTable) {
    var prefixDecodeTable = new Map();
    var mainPartDecodeTable = new Map();
    var prefixes = hashTable[0];
    var mainParts = hashTable[1];
    for (var i = 0; i < prefixes.length; i++) {
      prefixDecodeTable.set(numberToCssClass(i), prefixes[i]);
    }
    for (var j = 0; j < mainParts.length; j++) {
      mainPartDecodeTable.set(numberToCssClass(j), mainParts[j]);
    }

    return [prefixDecodeTable, mainPartDecodeTable];
  }
})();
