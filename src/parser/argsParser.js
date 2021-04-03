const path = require('path');
const { info } = require('../lib/utils');
const { CLIArgs, argv } = require('../lib/yargs');

const COMPILER_OPTION_KEYS = [
  CLIArgs.MODULE_RESOLUTION,
  CLIArgs.EXPERIMENTAL_DECORATORS,
  CLIArgs.SYNTHETIC_IMPORTS,
  CLIArgs.TARGET,
  CLIArgs.MODULE,
  CLIArgs.BASE_URL,
];

/**
 * Parses CLI args and custom webpack path if provided.
 *
 * @param {{ params, config }} args Object with params and config objects.
 * @return {Promise<{ params, config }>} Adjusted object with params and config objects.
 */
async function argsParser({ params, config }) {
  const cwd = argv?._?.length > 0 ? path.resolve(argv._[0]) : process.cwd();

  if (!cwd) {
    throw new TypeError(`Invalid cwd, '${cwd}' was given.`);
  }

  info('Parsing CLI args...');
  const compilerOptions = Object.values(CLIArgs)
    .filter((key) => COMPILER_OPTION_KEYS.indexOf(key) !== -1)
    .reduce((acc, cur) => {
      if (argv[cur]) {
        acc[cur] = argv[cur];
      }

      return acc;
    }, {});

  return {
    params: {
      ...params,
      cwd,
      template: argv[CLIArgs.TEMPLATE] || 'default',
      webpackConfigLocation:
        argv[CLIArgs.WEBPACK_CONFIG] || path.join(cwd, 'webpack.config.js'),
    },
    config: {
      ...config,
      compilerOptions,
    },
  };
}

module.exports = {
  argsParser,
};
