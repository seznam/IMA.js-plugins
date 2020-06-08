import common from '../../rollup.config.common';

export default Object.assign(
  {},
  common,
  {
    external: [
      'path'
    ],
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      exports: 'named'
    }
  });
