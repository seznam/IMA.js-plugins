import common from '../../rollup.config.common';

export default Object.assign({
  external: [
    '@ima/core',
    '@ima/plugin-local-storage'
  ],
  output: {
   file: 'dist/main.js',
   format: 'js'
 }
}, common);
