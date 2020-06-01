import common from '../../rollup.config.common';

export default Object.assign({
  external: [
    '@ima/core',
    '@ima/helpers'
  ],
  output: {
   file: 'dist/main.js',
   format: 'js'
 }
}, common);
