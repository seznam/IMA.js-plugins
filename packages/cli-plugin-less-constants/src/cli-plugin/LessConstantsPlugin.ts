import fs from 'fs';
import path from 'path';

import type { ImaCliPlugin, ImaCliArgs, ImaConfig } from '@ima/cli';
import { createLogger } from '@ima/dev-utils/logger';
import chalk from 'chalk';
import webpack from 'webpack';

import { generateCssConstants } from './generatorCssConstants';
import { generateLessConstants } from './generatorLessConstants';
import type { DefaultTheme, Themes, UnitValue } from './types';
import { createVerifyRegExps, getUsedConstants } from './verify';

export interface LessConstantsPluginOptions {
  entry: string;
  output?: string;
  outputCssConstants?: string;
  defaultTheme?: DefaultTheme;
  themes?: Themes;
  /**
   * List of directories that contain Less files to verify that all constants are used.
   */
  verify?: string[];
}

/**
 * Generates two .less files created from JS entry point - one file contains less variables
 * and the second file contains CSS variables, with support for light, dark and custom themes.
 *
 * The entry point file should contain a default export of an object
 * with values composed of LessConstantsPlugin unit functions.
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

    // Resolve entry path
    const { entry } = this._options;
    const entryPath = path.isAbsolute(entry)
      ? entry
      : path.resolve(args.rootDir, entry);

    if (!fs.existsSync(entryPath)) {
      this._logger.error(`entry file at path '${entryPath}' doesn't exist.`);

      process.exit(1);
    }

    this._logger.plugin(`Processing ${chalk.magenta(entry)} file..`, {
      trackTime: true,
    });

    // Resolve themes options
    const { defaultTheme, themes } = this._processThemeOptions();

    this._logger.plugin(
      `Themes: ${chalk.green(themes.join(', '))}; default theme: ${chalk.green(defaultTheme)}`
    );

    // Resolve output paths
    const outputPathLessConstants =
      this._options.output ??
      path.join(args.rootDir, 'build/less-constants/constants.less');
    const outputPathCssConstants =
      this._options.outputCssConstants ??
      path.join(args.rootDir, 'build/less-constants/cssConstants.less');

    // Let's do this
    try {
      const compiledEntry = await this._compileEntry(
        entryPath,
        args,
        imaConfig
      );

      // Generate less variables from entry module and write them to output file
      const lessConstants = generateLessConstants(compiledEntry);
      await fs.promises.mkdir(path.dirname(outputPathLessConstants), {
        recursive: true,
      });
      await fs.promises.writeFile(outputPathLessConstants, lessConstants, {
        encoding: 'utf8',
      });

      // Generate CSS variables from entry module and write them to output file
      const cssConstants = generateCssConstants(
        compiledEntry,
        defaultTheme,
        themes
      );
      await fs.promises.mkdir(path.dirname(outputPathCssConstants), {
        recursive: true,
      });
      await fs.promises.writeFile(outputPathCssConstants, cssConstants, {
        encoding: 'utf8',
      });

      // Verify that all constants are used in less files in specified directories
      if (this._options.verify) {
        await this._verifyConstantsUsed(lessConstants);
      }
    } catch (error) {
      this._logger.error(error instanceof Error ? error : 'unknown error');
      process.exit(1);
    }

    // Print output info
    this._logger.plugin(
      `generated: ${chalk.magenta(outputPathLessConstants.replace(args.rootDir, '.'))}`
    );
    this._logger.plugin(
      `generated: ${chalk.magenta(outputPathCssConstants.replace(args.rootDir, '.'))}`
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

  private _processThemeOptions(): {
    defaultTheme: DefaultTheme;
    themes: Themes;
  } {
    if (this._options.themes && !Array.isArray(this._options.themes)) {
      this._logger.error(`Invalid themes option. Expected an array of themes.`);
      process.exit(1);
    }

    const defaultTheme = this._options.defaultTheme ?? 'light';

    const validDefaultThemes = ['light', 'dark'];

    if (!validDefaultThemes.includes(defaultTheme)) {
      this._logger.error(
        `Invalid default theme '${chalk.redBright(defaultTheme)}'. Valid options are: ${chalk.green(validDefaultThemes.join(', '))}.`
      );
      process.exit(1);
    }

    const themes = !this._options.themes
      ? (['light'] as Themes)
      : this._options.themes;

    if (!themes.includes(defaultTheme)) {
      this._logger.error(
        `Default theme '${chalk.redBright(defaultTheme)}' must be included in themes list.`
      );
      process.exit(1);
    }

    if (
      themes.length > 1 &&
      (!themes.includes('light') || !themes.includes('dark'))
    ) {
      this._logger.error(
        `Themes list must include both '${chalk.green('light')}' and '${chalk.green('dark')}' when multiple themes are specified.`
      );
      process.exit(1);
    }

    return {
      defaultTheme,
      themes,
    };
  }

  private async _verifyConstantsUsed(lessConstants: string): Promise<void> {
    if (!Array.isArray(this._options.verify) || !this._options.verify.length) {
      return;
    }

    /**
     * Create regular expressions for each constant in advance to speed up the process.
     */
    const verifyRegExps = createVerifyRegExps(lessConstants);

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
      usedConstants.push(...(await getUsedConstants(lessFile, verifyRegExps)));
    }

    /**
     * Filter out unused constants.
     */
    usedConstants = [...new Set(usedConstants)];
    const unusedConstants: string[] = [];
    for (const constant of Object.keys(verifyRegExps)) {
      if (usedConstants.indexOf(constant) === -1) {
        unusedConstants.push(constant);
      }
    }

    if (unusedConstants.length) {
      this._logger.plugin(
        'The following constants are not used in any less file (as less variables or CSS variables):'
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
}

export { LessConstantsPlugin };
