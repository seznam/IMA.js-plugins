/**
 * Slugify provided value label (camelCase or PascalCase into kebab-case)
 *
 * @param value
 * @returns { string }
 */
function slugify(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

export { slugify };
