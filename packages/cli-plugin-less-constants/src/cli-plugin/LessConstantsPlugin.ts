import fs from 'fs';
import path from 'path';

import type { ImaCliPlugin, ImaCliArgs, ImaConfig } from '@ima/cli';
import { createLogger } from '@ima/dev-utils/logger';
import chalk from 'chalk';
import webpack from 'webpack';

import type { UnitValue } from './generator';
import { generateLessVariables } from './generator';
import { createLessConstantsRegExp, getUsedLessConstants } from './verify';

export interface LessConstantsPluginOptions {
  entry: string;
  output?: string;
  /**
   * List of directories that contain Less files to verify that all constants are used.
   */
  verify?: string[];
}

/**
 * Generates .less file with less variables created from JS entry point.
 * The entry point should consist of default export of an object
 * with key values composed of LessConstantsPlugin helper functions.
 */
class LessConstantsPlugin implements ImaCliPlugin {
  private _options: LessConstantsPluginOptions;
  private _logger: ReturnType<typeof createLogger>;

  readonly name = 'LessConstantsPlugin';

  constructor(options: LessConstantsPluginOptions) {
    this._options = options || {};
    this._logger = createLogger(this.name);
  }

  /**
   * We'll generate less variables files in the preProcess hook, in order
   * for it to be usable as an import in globals.less file.
   *
   * @param args
   * @param imaConfig
   */
  async preProcess(args: ImaCliArgs, imaConfig: ImaConfig): Promise<void> {
    if (!this._options.entry) {
      this._logger.error('closing compiler... entry file was not provided.');

      process.exit(1);
    }

    let outputPath = '';
    const { entry } = this._options;
    const entryPath = path.isAbsolute(entry)
      ? entry
      : path.resolve(args.rootDir, entry);

    if (!fs.existsSync(entryPath)) {
      this._logger.error(`entry file at path '${entryPath}' doesn't exist.`);

      process.exit(1);
    }

    // Print output info
    this._logger.plugin(`Processing ${chalk.magenta(entry)} file..`, {
      trackTime: true,
    });

    try {
      // Generate less variables from entry module
      const lessConstants = generateLessVariables(
        await this._compileEntry(entryPath, args, imaConfig)
      );

      if (this._options.verify) {
        /**
         * Create regular expressions for each constant in advance to speed up the process.
         */
        const lessConstantsRegex = createLessConstantsRegExp(lessConstants);

        /**
         * Get all Less files in the specified directories to verify.
         */
        const lessFilesToVerify = this._options.verify.reduce((acc, curr) => {
          acc.push(
            ...fs
              .readdirSync(curr, { recursive: true })
              .filter(file => (file as string).endsWith('.less'))
              .map(file => path.join(curr, file as string))
          );

          return acc;
        }, [] as string[]);

        /**
         * Get all used constants in the specified Less files.
         */
        let usedConstants: string[] = [];
        for (const lessFile of lessFilesToVerify) {
          usedConstants.push(
            ...(await getUsedLessConstants(lessFile, lessConstantsRegex))
          );
        }

        /**
         * Filter out unused constants.
         */
        usedConstants = [...new Set(usedConstants)];
        const unusedConstants: string[] = [];
        for (const constant of Object.keys(lessConstantsRegex)) {
          if (usedConstants.indexOf(constant) === -1) {
            unusedConstants.push(constant);
          }
        }

        if (unusedConstants.length) {
          this._logger.plugin(
            'The following constants are not used in any less file:'
          );
          for (const unusedConstant of unusedConstants) {
            this._logger.plugin(unusedConstant);
          }
        } else {
          this._logger.plugin(
            `All constants are used in less files in ${chalk.magenta(
              this._options.verify
            )}`
          );
        }
      }

      // Write generated less file to filesystem
      outputPath =
        this._options.output ??
        path.join(args.rootDir, 'build/less-constants/constants.less');

      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.promises.writeFile(outputPath, lessConstants, {
        encoding: 'utf8',
      });
    } catch (error) {
      this._logger.error(error instanceof Error ? error : 'unknown error');
      process.exit(1);
    }

    // Print output info
    this._logger.plugin(
      `generated: ${chalk.magenta(outputPath.replace(args.rootDir, '.'))}`
    );
  }

  /**
   * Runs entry file through webpack to bypass esm/cjs compatibility issues
   * and generate one nodeJS compatible file, which can be imported and further procesed.
   * Additionally this works with custom defined webpack aliases in ima config.
   *
   * @param modulePath
   * @param args
   * @param imaConfig
   */
  private async _compileEntry(
    modulePath: string,
    args: ImaCliArgs,
    imaConfig: ImaConfig
  ): Promise<Record<string, UnitValue>> {
    const outputDir = path.join(
      args.rootDir,
      './node_modules/.cache/less-constants-plugin'
    );

    // Compile entry point with webpack
    return new Promise((resolve, reject) => {
      webpack(
        {
          target: 'node18',
          mode: 'none',
          output: {
            path: outputDir,
            libraryTarget: 'commonjs2',
          },
          entry: { lessConstantsEntry: modulePath },
          module: {
            rules: [
              {
                /**
                 * Allow interop import of .mjs modules.
                 */
                test: /\.mjs$/,
                type: 'javascript/auto',
                resolve: {
                  fullySpecified: false,
                },
              },
            ],
          },
          resolve: {
            alias: {
              app: path.join(args.rootDir, 'app'),
              ...imaConfig.webpackAliases,
            },
          },
          cache: {
            name: 'less-constants-plugin',
            type: 'filesystem',
          },
          optimization: {
            moduleIds: 'named',
            chunkIds: 'named',
            splitChunks: {
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
                },
              },
            },
          },
          plugins: [
            new webpack.DefinePlugin({
              $Debug: false,
            }),
          ],
        },
        err => {
          if (err) {
            reject(err);
          }

          // Require generated bundle
          resolve(
            import(path.join(outputDir, '/lessConstantsEntry.js')).then(
              module => module.default
            )
          );
        }
      );
    });
  }
}

export { LessConstantsPlugin };
