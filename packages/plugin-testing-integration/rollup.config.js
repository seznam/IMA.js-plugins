import common from '../../rollup.config.common';

export default Object.assign(
  {},
  common,
  {
    external: [
      'canvas',
      'bufferutil',
      'utf-8-validate'
    ],
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      exports: 'named'
    }
  });
