import fs from 'fs';
import path from 'path';

import { ImaCliPlugin, ImaConfig, ImaConfigurationContext } from '@ima/cli';
// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import { Configuration } from 'webpack';
import { CommandBuilder } from 'yargs';

import {
  ScrambleCssMinimizerOptions,
  ScrambleCssMinimizer,
} from './minimizer/ScrambleCssMinimizer';

// Extend existing cli args interface with new values
declare module '@ima/cli' {
  interface ImaCliArgs {
    scrambleCss?: boolean;
  }
}
export interface ScrambleCssPluginOptions {
  scrambleCssMinimizerOptions?: ScrambleCssMinimizerOptions;
}

function createCliArgs(): CommandBuilder {
  return {
    scrambleCss: {
      desc: 'Scrambles (uglifies) classNames in css files (defaults to `true` for production builds)',
      type: 'boolean',
    },
  };
}

/**
 * Minifies component classnames and generates hashtable of transformed classnames
 * which can be later used for backwards translation.
 */
class ScrambleCssPlugin implements ImaCliPlugin {
  private _options: ScrambleCssPluginOptions;

  readonly name = 'ScrambleCssPlugin';
  readonly cliArgs = {
    build: createCliArgs(),
    dev: createCliArgs(),
  };

  constructor(options: Partial<ScrambleCssPluginOptions> = {}) {
    this._options = options;
  }

  async webpack(
    config: Configuration,
    ctx: ImaConfigurationContext,
    imaConfig: ImaConfig
  ): Promise<Configuration> {
    /**
     * Exclude this plugin from vendor swc transformations,
     * this is because we're using cli/client code mix, which
     * would result in errors
     */
    imaConfig.transformVendorPaths = {
      ...imaConfig.transformVendorPaths,
      exclude: [
        ...(imaConfig.transformVendorPaths?.exclude ?? []),
        /@ima\/cli-plugin-scramble-css/,
      ],
    };

    // Add only in css processing context
    if (!ctx.processCss) {
      return config;
    }

    // Bail if not enabled (either by env or command)
    if (!ctx.scrambleCss || ctx.environment === 'production') {
      return config;
    }

    // Copy debug script to app public/static
    config.plugins?.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../static'),
            to: 'static/public',
            noErrorOnMissing: true,
          },
        ],
      })
    );

    /**
     * Set plugin default options. We need to do this here, rather than in
     * the constructor since we have to have access to the `config.output.path`.
     */
    if (
      !this._options.scrambleCssMinimizerOptions?.hashTableFilename ||
      !path.isAbsolute(
        this._options.scrambleCssMinimizerOptions?.hashTableFilename
      )
    ) {
      const { hashTableFilename } =
        this._options.scrambleCssMinimizerOptions || {};

      // Set absolute hash table path
      const hashTablePath =
        hashTableFilename && path.isAbsolute(hashTableFilename)
          ? hashTableFilename
          : path.join(
              config?.output?.path ?? process.cwd(),
              hashTableFilename ?? 'static/css/hashTable.json'
            );

      // Update plugin options
      this._options = {
        ...this._options,
        scrambleCssMinimizerOptions: {
          ...this._options?.scrambleCssMinimizerOptions,
          hashTableFilename: hashTablePath,
        },
      };
    }

    // Init minimizer
    const scrambleCssMinimizer = new ScrambleCssMinimizer(
      this._options?.scrambleCssMinimizerOptions
    );

    /**
     * Remove existing hashTable.json so the web does not try
     * to load css with invalid scrambled CSS.
     */
    if (
      this._options.scrambleCssMinimizerOptions?.hashTableFilename &&
      fs.existsSync(
        this._options.scrambleCssMinimizerOptions?.hashTableFilename
      )
    ) {
      await fs.promises.rm(
        this._options.scrambleCssMinimizerOptions?.hashTableFilename
      );
    }

    if (ctx.scrambleCss) {
      if (ctx.command === 'dev') {
        /**
         * Force minimizer in development if CLI argument is present.
         * This will remove all other minimizers except the CSS scrambler
         * and force minimization in dev mode.
         */
        config.optimization = {
          ...config.optimization,
          minimize: !ctx.isServer,
          minimizer: [scrambleCssMinimizer],
        };
      } else {
        /**
         * Enable minimizer by default during build, but allow it
         * to be disabled explicitly using the CLI arg.
         */
        config.optimization?.minimizer?.unshift(scrambleCssMinimizer);
      }
    }

    return config;
  }
}

export { ScrambleCssPlugin };
