import fs from 'fs';

export function createLessConstantsRegExp(lessConstants: string) {
  const lessConstantsRegExp: Record<string, RegExp> = {};

  lessConstants
    .split('\n')
    .filter(
      constant =>
        constant && !constant.startsWith('//') && !constant.endsWith('}')
    )
    .forEach(constant => {
      const trimmedConstant = constant.split(':')[0].trim();

      if (trimmedConstant.startsWith('@')) {
        lessConstantsRegExp[trimmedConstant] = new RegExp(
          `(${trimmedConstant})(?!\\w|-)`,
          'gm'
        );
      } else {
        lessConstantsRegExp[trimmedConstant] = new RegExp(
          `\\[(${trimmedConstant})\\]`,
          'gm'
        );
      }
    });

  return lessConstantsRegExp;
}

export async function getUsedLessConstants(
  filename: string,
  lessConstantsRegex: Record<string, RegExp>
) {
  const usedConstants: string[] = [];
  const contents = await fs.promises.readFile(filename, 'utf-8');

  for (const constant in lessConstantsRegex) {
    if (contents.search(lessConstantsRegex[constant]) === -1) {
      continue;
    }

    usedConstants.push(constant);
  }

  return usedConstants;
}
