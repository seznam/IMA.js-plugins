import fs from 'fs';

type VerifyRegExps = Record<string, Record<'css' | 'less', RegExp>>;

export function createVerifyRegExps(lessConstants: string) {
  const verifyRegExps: VerifyRegExps = {};

  let lastLessMapKey = '';

  lessConstants
    .split('\n')
    .filter(
      row => row && !row.startsWith('//') // remove empty lines and comments
    )
    .forEach(row => {
      // end of lessMap or theme
      if (row.endsWith('}')) {
        lastLessMapKey = ''; // reset the key, we are out of lessMap
        return;
      }

      const constantRaw = row.split(':')[0]!.trim();
      const constant = constantRaw.replace(/^@/, ''); // remove first '@'
      const isLessMapItem = !constantRaw.startsWith('@') && lastLessMapKey;
      const isThemeItem = !constantRaw.startsWith('@') && !lastLessMapKey;

      // first row of a theme - we do not check usage of individual items, just the theme itself
      if (row.endsWith('//theme')) {
        verifyRegExps[constant] = {
          css: new RegExp(`--${constant}(?!\\w|-)`),
          less: new RegExp(`@${constant}\\[`),
        };
        return;
      }

      // first row of a lessMap - remember the key, we will need it to check usage of each item
      if (row.endsWith('//lessMap')) {
        lastLessMapKey = constant;
        return;
      }

      // check item of lessMap
      if (isLessMapItem) {
        verifyRegExps[`${lastLessMapKey}[${constant}]`] = {
          css: new RegExp(`--${lastLessMapKey}-${constant}(?!\\w|-)`),
          less: new RegExp(`@${lastLessMapKey}\\[${constant}\\]`),
        };
        return;
      }

      // we do not check individual items of themes
      if (isThemeItem) {
        return;
      }

      // common constant
      verifyRegExps[constant] = {
        css: new RegExp(`--${constant}(?!\\w|-)`),
        less: new RegExp(`@${constant}(?!\\w|-)`),
      };
    });

  return verifyRegExps;
}

export async function getUsedConstants(
  filename: string,
  verifyRegExps: VerifyRegExps
) {
  const usedConstants: string[] = [];
  const contents = await fs.promises.readFile(filename, 'utf-8');

  for (const constant in verifyRegExps) {
    if (
      contents.search(verifyRegExps[constant]!.less) > -1 ||
      contents.search(verifyRegExps[constant]!.css) > -1
    ) {
      usedConstants.push(constant);
    }
  }

  return usedConstants;
}
