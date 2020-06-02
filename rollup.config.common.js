import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  cache: false,
  // external: [
  //   'react',
  //   'react-dom',
  //   '@ima/core',
  // ],
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'js'
  },
  treeshake: false,
  plugins: [
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json'],
    }),
    babel({
      moduleIds: true,
      presets: ['@babel/preset-react'],
    }),
    json({
      preferConst: true, // Default: false
      compact: true, // Default: false
      namedExports: true, // Default: true
    }),
    peerDepsExternal(),
  ],
}
