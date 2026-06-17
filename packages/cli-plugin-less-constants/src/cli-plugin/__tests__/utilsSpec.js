import { slugify } from '../utils';

describe('cli-plugin utils', () => {
  it.each([
    ['camelCase', 'camel-case'],
    ['PascalCase', 'pascal-case'],
    ['longCamelCaseLabel', 'long-camel-case-label'],
    ['already-slugified', 'already-slugified'],
    ['breakpoint2XL', 'breakpoint2-xl'],
    ['CNSPlugin', 'cns-plugin'],
    ['colorLink-hover', 'color-link-hover'],
    ['grayE-80', 'gray-e-80'],
  ])('slugifies %s', (label, result) => {
    expect(slugify(label)).toBe(result);
  });

  it('slugifies empty string', () => {
    expect(slugify('')).toBe('');
  });
});
