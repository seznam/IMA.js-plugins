import common from '../../rollup.config.common';

export default Object.assign({}, common, {
  external: ['path'],
  // Temporarily disabled treeshake due to https://github.com/rollup/rollup/issues/3652
  treeshake: false,
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    exports: 'named'
  }
});
