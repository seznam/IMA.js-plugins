import type { MapUnit, MediaUnit, ThemeUnit, Unit } from '../units';

/**
 * Slugify provided value label (camelCase or PascalCase into kebab-case)
 */
function slugify(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function isProperty(value: unknown): value is Unit {
  return value instanceof Object && (value as Unit).__propertyDeclaration;
}

function isMediaQuery(value: unknown): value is MediaUnit {
  return value instanceof Object && (value as MediaUnit).__mediaQuery;
}

function isLessMap(value: unknown): value is MapUnit {
  return value instanceof Object && (value as MapUnit).__lessMap;
}

function isTheme(value: unknown): value is ThemeUnit {
  return value instanceof Object && (value as ThemeUnit).__theme;
}

export { slugify, isProperty, isMediaQuery, isLessMap, isTheme };
