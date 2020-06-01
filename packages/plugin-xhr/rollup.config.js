import common from '../../rollup.config.common';

export default Object.assign({
  external: ['@ima/core'],
  output: {
   file: 'dist/main.js',
   format: 'js'
 }
}, common);
