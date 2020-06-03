import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const onwarn = warning => {
  // Silence circular dependency warning for moment package
  if (
    warning.code === 'CIRCULAR_DEPENDENCY'
  ) {
    return
  }

  console.warn(`(!) ${warning.message}`)
}

export default {
  cache: true,
  input: 'src/main.js',
  onwarn,
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    exports: 'named'
  },
  treeshake: false,
  plugins: [
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      preferBuiltins: false
    }),
    babel({
      babelHelpers: 'bundled',
      moduleIds: true,
      presets: ['@babel/preset-react'],
    }),
    json({
      preferConst: true, // Default: false
      compact: true, // Default: false
      namedExports: true, // Default: true
    }),
    peerDepsExternal(),
    commonjs()
  ],
}
