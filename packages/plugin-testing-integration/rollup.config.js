import {
  createRollupESConfig,
  createRollupES5Config
} from '../../createRollupConfig';

let esConfig = createRollupESConfig();
let es5Config = createRollupES5Config();

esConfig.external = ['path'].concat(esConfig.external);
es5Config.external = ['path'].concat(es5Config.external);

export default [esConfig, es5Config];
