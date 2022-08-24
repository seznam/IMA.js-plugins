const babel = require('@babel/core');
const filesRe = /\.(js|jsx|ts|tsx)$/;

module.exports = {
  process: function (src, filename) {
    if (filesRe.test(filename)) {
      return babel.transform(src, {
        filename,
        presets: [
          '@babel/preset-react',
          '@babel/preset-typescript',
          'babel-preset-jest'
        ],
        plugins: ['@babel/plugin-transform-modules-commonjs'],
        retainLines: true
      }).code;
    }

    return src;
  }
};
