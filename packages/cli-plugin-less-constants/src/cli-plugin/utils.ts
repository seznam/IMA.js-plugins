/**
 * Slugify provided value label (camelCase into dash-case)
 *
 * @param label
 * @returns { string }
 */
function slugify(label: string): string {
  let result = '';

  for (let i = 0; i < label.length; i++) {
    const char = label.substring(i, i + 1);
    if (i && !/-|\d/.test(char) && char.toUpperCase() === char) {
      result += `-${char.toLowerCase()}`;
    } else {
      result += char;
    }
  }

  return result;
}

export { slugify };
