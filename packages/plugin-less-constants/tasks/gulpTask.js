const babel = require('babel-core');

const fs = require('fs');
const gulp = require('gulp');
const path = require('path');

global.$Debug = global.$Debug === undefined ? true : global.$Debug;

gulp.task('less:constants', lessConstants); // gulp 3
exports['less:constants'] = lessConstants; // gulp 4
function lessConstants(done) {
  const PROGRESS_FILE = './app/config/layout.js';
  let output =
    `// THIS FILE IS GENERATED AUTOMATICALLY FROM ${PROGRESS_FILE}\n` +
    '// DO NOT MODIFY THIS FILE, ALL CHANGES WILL BE DISCARDED\n' +
    '\n';

  if (fs.existsSync(PROGRESS_FILE)) {
    output += getFileConfigOutput(PROGRESS_FILE);
  }

  fs.writeFileSync('./app/assets/less/settings.less', output, {
    encoding: 'utf-8'
  });

  done();
}

function getFileConfigOutput(file) {
  let output = '';
  let fileConfigContents = fs
    .readFileSync(file, 'utf-8')
    .replace(/import\s+(\S+)\s+from\s+['"](\S+)['"]/g, (match, p1, p2) => {
      let resolvedPath = p2.startsWith('.')
        ? path.resolve('./app/config', p2).replace(/\\/g, '\\\\')
        : p2;

      return `import ${p1} from '${resolvedPath}'`;
    })
    .replace(/export\s+(\S+)\s*/, 'exported.$1 = ');

  fileConfigContents = babel.transform(fileConfigContents, {
    plugins: ['transform-es2015-modules-commonjs'],
    retainLines: true
  }).code;

  let exported = {};
  eval(fileConfigContents);
  let fileConfig = exported.default;

  for (let propertyName in fileConfig) {
    if (!fileConfig.hasOwnProperty(propertyName)) {
      continue;
    }

    output += process(propertyName, fileConfig[propertyName], '@');
  }

  return output;
}

function process(property, value, prefix) {
  const subPrefix = getSubPrefix(property, prefix);

  if (value instanceof Object && value.__lessMap) {
    return `${subPrefix}: {\n${value.toString()}}\n`;
  }

  if (value instanceof Object && !value.__propertyDeclaration) {
    return (
      Object.keys(value)
        .map(subProperty => process(subProperty, value[subProperty], subPrefix))
        .join('') + '\n'
    ); // add extra empty line after a group of properties
  }

  return `${subPrefix}: ${value.toString()};\n`;
}

function getSubPrefix(property, prefix) {
  return prefix + (prefix.length > 1 ? '-' : '') + slugify(property);
}

function slugify(label) {
  let result = '';

  for (let i = 0; i < label.length; i++) {
    let char = label.substring(i, i + 1);
    if (i && !/-|\d/.test(char) && char.toUpperCase() === char) {
      result += '-' + char.toLowerCase();
    } else {
      result += char;
    }
  }

  return result;
}
