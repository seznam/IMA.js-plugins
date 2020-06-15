import common from '../../rollup.config.common';

export default Object.assign({}, common, {
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    exports: 'named',
  },
});
