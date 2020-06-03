import common from '../../rollup.config.common';

export default Object.assign(
  {},
  common,
  {
    external: [
      'platform'
    ],
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      exports: 'named'
    }
  });
