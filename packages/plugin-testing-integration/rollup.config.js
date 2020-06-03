import common from '../../rollup.config.common';

export default Object.assign(
  {},
  common,
  {
    external: [
      '@ima/core',
      '@ima/helpers'
    ],
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      exports: 'named'
    }
  });
