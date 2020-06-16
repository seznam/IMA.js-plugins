let babel = require('@babel/core');

module.exports = {
  process: function (src, filename) {
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
      return babel.transform(src, {
        filename,
        presets: ['@babel/preset-react', 'babel-preset-jest'],
        plugins: ['@babel/plugin-transform-modules-commonjs'],
        retainLines: true
      }).code;
    }

    return src;
  }
};
