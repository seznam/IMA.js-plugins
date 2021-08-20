import copy from 'rollup-plugin-copy';

import {
  createRollupESConfig,
  createRollupES5Config
} from '../../createRollupConfig';

let esConfig = createRollupESConfig();
let es5Config = createRollupES5Config();

let extendedPlugins = [
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
];

esConfig.plugins.push(...extendedPlugins);
es5Config.plugins.push(...extendedPlugins);

export default [esConfig, es5Config];
