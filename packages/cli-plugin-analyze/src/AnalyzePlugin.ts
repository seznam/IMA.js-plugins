import path from 'path';

import {
  ImaConfigurationContext,
  ImaCliCommand,
  ImaCliPlugin,
  ImaCliArgs,
} from '@ima/cli';
import { createLogger } from '@ima/dev-utils/logger';
import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin';
import open from 'better-opn';
import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import chalk from 'chalk';
import { Configuration, WebpackPluginInstance } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CommandBuilder } from 'yargs';

// Extend existing cli args interface with new values
declare module '@ima/cli' {
  interface ImaCliArgs {
    analyze?: ImaConfigurationContext['name'];
  }
}

export interface AnalyzePluginOptions {
  open?: boolean;
  bundleStatsOptions?: BundleStatsWebpackPlugin.Options;
  bundleAnalyzerOptions?: BundleAnalyzerPlugin.Options;
}

/**
 * Initializes webpack bundle analyzer plugins.
 */
class AnalyzePlugin implements ImaCliPlugin {
  #options: AnalyzePluginOptions;
  #logger: ReturnType<typeof createLogger>;

  readonly name = 'AnalyzePlugin';
  readonly cliArgs: Partial<Record<ImaCliCommand, CommandBuilder>> = {
    build: {
      analyze: {
        desc: 'Runs multiple webpack bundle analyzer plugins on given entry',
        type: 'string',
        choices: ['server', 'client', 'client.es'],
      },
    },
  };

  constructor(options: AnalyzePluginOptions) {
    this.#options = options;
    this.#logger = createLogger(this.name);
  }

  async webpack(
    config: Configuration,
    ctx: ImaConfigurationContext
  ): Promise<Configuration> {
    const { name, analyze } = ctx;

    if (!analyze) {
      return config;
    }

    if (analyze && analyze === name) {
      config.plugins?.push(
        new BundleStatsWebpackPlugin({
          silent: true,
          ...(this.#options?.bundleStatsOptions ?? {}),
        }) as WebpackPluginInstance,
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          logLevel: 'silent',
          openAnalyzer: false,
          ...(this.#options?.bundleAnalyzerOptions ?? {}),
        }) as unknown as WebpackPluginInstance,
        new StatoscopeWebpackPlugin({
          saveTo: path.join(config.output?.path ?? '', 'statoscope.html'),
          saveStatsTo: path.join(config.output?.path ?? '', 'stats.json'),
        })
      );
    }

    return config;
  }

  async postProcess(args: ImaCliArgs): Promise<void> {
    if (!args.analyze) {
      return;
    }

    const reportPath = path.join(args.rootDir, 'build/report.html');
    const statsPath = path.join(args.rootDir, 'build/stats.json');
    const bundleStatsPath = path.join(args.rootDir, 'build/bundle-stats.html');
    const statoscopeStatsPath = path.join(
      args.rootDir,
      'build/statoscope.html'
    );

    this.#logger.plugin('generated following reports:');

    // Print generated files info
    this.#logger.write(
      `${chalk.gray('├')} ${chalk.bold.underline(
        'Webpack Bundle Analyzer:'
      )} ${chalk.magenta(reportPath)}`
    );

    this.#logger.write(
      `${chalk.gray('├')} ${chalk.bold.underline(
        'Webpack Bundle Stats:'
      )} ${chalk.magenta(bundleStatsPath)}`
    );

    this.#logger.write(
      `${chalk.gray('└')} ${chalk.bold.underline(
        'Webpack Statoscope:'
      )} ${chalk.magenta(statoscopeStatsPath)}`
    );

    // Print info about stats.json usage
    this.#logger.write(
      chalk.bold(
        `\nThe generated ${chalk.green(
          'stats.js'
        )} file can be used in the following online analyzers:`
      )
    );
    this.#logger.write(
      `${chalk.gray('├')} ${chalk.green('stats.js')} - ${chalk.magenta(
        statsPath
      )}`
    );
    this.#logger.write(
      `${chalk.gray('├')} https://alexkuz.github.io/webpack-chart/ ${chalk.gray(
        '- interactive pie chart'
      )}`
    );
    this.#logger.write(
      `${chalk.gray(
        '├'
      )} https://chrisbateman.github.io/webpack-visualizer/ ${chalk.gray(
        '- visualize and analyze bundle'
      )}`
    );
    this.#logger.write(
      `${chalk.gray('└')} https://webpack.jakoblind.no/optimize/ ${chalk.gray(
        '- analyze and optimize bundle'
      )}`
    );

    if (this.#options?.open !== false) {
      open(`file://${reportPath}`);
      open(`file://${bundleStatsPath}`);
    }
  }
}

export { AnalyzePlugin };
