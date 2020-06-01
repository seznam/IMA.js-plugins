import common from '../../rollup.config.common';

export default Object.assign({
  external: [
    '@ima/core',
    '@ima/plugin-websocket',
    '@ima/gulp-tasks'
  ],
  output: {
   file: 'dist/main.js',
   format: 'js'
 }
}, common);
