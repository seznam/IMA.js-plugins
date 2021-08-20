import { terser } from 'rollup-plugin-terser';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const babelBaseConfig = {
  babelrc: false,
  moduleIds: true,
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: false }
      }
    ]
  ]
};

function createRollupConfig() {
  const config = {
    input: 'src/main.js',
    treeshake: {
      moduleSideEffects: 'no-external'
    },
    plugins: [
      peerDepsExternal({
        includeDependencies: true
      }),
      resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json'],
        preferBuiltins: true
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        moduleIds: true,
        presets: [
          '@babel/preset-react',
          [
            '@babel/env',
            {
              targets: {
                node: '12'
              },
              modules: false,
              useBuiltIns: 'usage',
              corejs: { version: 3, proposals: false }
            }
          ]
        ]
      }),
      json({
        preferConst: true, // Default: false
        compact: true, // Default: false
        namedExports: true // Default: true
      })
    ]
  };

  return config;
}

function createRollupESConfig() {
  let config = createRollupConfig();

  config.output = [
    {
      dir: './dist',
      entryFileNames: '[name].cjs',
      format: 'cjs',
      exports: 'named'
    },
    {
      dir: './dist',
      entryFileNames: '[name].js',
      format: 'cjs',
      exports: 'named'
    },
    {
      dir: './dist',
      entryFileNames: '[name].mjs',
      format: 'esm',
      exports: 'named'
    }
  ];

  return config;
}

function createRollupES5Config() {
  let config = createRollupConfig();

  config.output = [
    {
      file: `./dist/main.es5.js`,
      format: 'cjs',
      exports: 'named',
      plugins: [getBabelOutputPlugin(babelBaseConfig), terser()]
    }
  ];

  return config;
}

export default createRollupConfig;

export { createRollupConfig, createRollupESConfig, createRollupES5Config };
