import common from '../../rollup.config.common';

export default Object.assign(
  {},
  common,
  {
    external: ['@ima/plugin-self-xss'],
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      exports: 'named'
    }
  });
