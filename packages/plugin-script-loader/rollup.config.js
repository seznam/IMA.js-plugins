import common from '../../rollup.config.common';

export default Object.assign({
  external: ['@ima/plugin-resource-loader'],
  output: {
   file: 'dist/main.js',
   format: 'js'
 }
}, common);
