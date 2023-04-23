const CLASSNAME_CHARS = (
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '-'
).split('');

const EXTENDED_CLASSNAME_CHARS = (
  CLASSNAME_CHARS.join('') + '0123456789'
).split('');

// Forbidden scrambled CSS classes (the matching is case insensitive).
const FORBIDDEN_CLASSNAMES: string[] = ['ad'];

const forbiddenNumbersCache: number[] = [];
let maxProcessedNumber = -1;

/**
 * Converts numbers into valid CSS classes.
 *
 * @param {number} number
 * @returns {string} CSS class.
 */
function numberToCssClassIgnoringForbidden(number: number): string {
  if (number < CLASSNAME_CHARS.length) {
    return CLASSNAME_CHARS[number];
  }

  // we have to "shift" the number to adjust for the gap between base53 and
  // base64 encoding
  number += EXTENDED_CLASSNAME_CHARS.length - CLASSNAME_CHARS.length;
  let className = '';

  while (number >= CLASSNAME_CHARS.length) {
    className =
      EXTENDED_CLASSNAME_CHARS[number % EXTENDED_CLASSNAME_CHARS.length] +
      className;
    number = Math.floor(number / EXTENDED_CLASSNAME_CHARS.length);
  }

  return number ? CLASSNAME_CHARS[number - 1] + className : `_${className}`;
}

function numberToCssClass(number: number, forbiddenCount = 0): string {
  const offseted = number + forbiddenCount;

  if (offseted > maxProcessedNumber) {
    for (let i = maxProcessedNumber + 1; i <= offseted; i++) {
      const className = numberToCssClassIgnoringForbidden(i);

      if (isClassForbidden(className) && !forbiddenNumbersCache.includes(i)) {
        forbiddenNumbersCache.push(i);
        forbiddenNumbersCache.sort((a: number, b: number) => b - a); // descending order
      }
    }

    maxProcessedNumber = offseted;
  }

  const newForbiddenCount = countForbiddenNumbersNotGreaterThan(offseted);

  if (forbiddenCount === newForbiddenCount) {
    return numberToCssClassIgnoringForbidden(offseted);
  }

  return numberToCssClass(number, newForbiddenCount);
}

function isClassForbidden(className: string): boolean {
  return FORBIDDEN_CLASSNAMES.some((forbidden: string) =>
    className.toLowerCase().includes(forbidden.toLowerCase())
  );
}

function countForbiddenNumbersNotGreaterThan(number: number): number {
  if (number > maxProcessedNumber) {
    console.error(
      `countForbiddenNumbersNotGreatetThan(number) called with ${number}, but it can't be greater than maxProcessedNumber: ${maxProcessedNumber}`
    );

    return 0;
  }

  if (number === maxProcessedNumber) {
    return forbiddenNumbersCache.length;
  }

  let index: number;

  for (index = 0; index < forbiddenNumbersCache.length; index++) {
    if (number >= forbiddenNumbersCache[index]) {
      break;
    }
  }

  return forbiddenNumbersCache.length - index;
}

function clearCache() {
  forbiddenNumbersCache.length = 0;
  maxProcessedNumber = -1;
}

export { clearCache, FORBIDDEN_CLASSNAMES, numberToCssClass };
