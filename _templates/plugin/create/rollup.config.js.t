---
to: packages/<%= h.changeCase.paramCase(name) %>/rollup.config.js
---
import common from '../../rollup.config.common';

export default Object.assign({}, common, {
  external: [],
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    exports: 'named',
  },
});
