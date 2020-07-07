import common from '../../rollup.config.common';
import copy from 'rollup-plugin-copy';

export default Object.assign({}, common, {
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    exports: 'named'
  },
  plugins: [
    copy({
      targets: [
        {
          src: [
            'src/locales/ima-plugin-self-xssCS.json',
            'src/locales/ima-plugin-self-xssEN.json'
          ],
          dest: 'dist/locales'
        }
      ]
    })
  ]
});
