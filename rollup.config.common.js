import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  cache: true,
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    exports: 'named'
  },
  treeshake: true,
  plugins: [
    peerDepsExternal({
      includeDependencies: true
    }),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      preferBuiltins: true
    }),
    babel({
      babelHelpers: 'bundled',
      moduleIds: true,
      presets: ['@babel/preset-react']
    }),
    json({
      preferConst: true, // Default: false
      compact: true, // Default: false
      namedExports: true // Default: true
    }),
    commonjs()
  ]
};
