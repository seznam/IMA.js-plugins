import common from '../../rollup.config.common';

export default Object.assign(
  {},
  common,
  {
    external: [
      'clone'
    ],
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      exports: 'named'
    }
  });
