import type {
  ImaConfigurationContext,
  ImaCliPlugin,
  ImaConfig,
} from '@ima/cli';
import { findRules } from '@ima/cli';
import { createLogger } from '@ima/dev-utils/logger';
import type { Configuration } from 'webpack';

export interface LegacyCSSPluginOptions {
  /**
   * Browserslist configuration string for postcss-preset-env for legacy CSS.
   */
  cssBrowsersTarget?: ImaConfig['cssBrowsersTarget'];
  /**
   * Equivalent to postcss function but for legacy css, when enabled with enableLegacyCss option.
   */
  postcss?: ImaConfig['postcss'];
}

/**
 * Builds legacy CSS alongsite legacy client bundle. To be able to serve
 * two versions of CSS one for older and one for more modern browsers
 * with less polyfills.
 */
class LegacyCSSPlugin implements ImaCliPlugin {
  #options: Required<LegacyCSSPluginOptions>;
  #logger: ReturnType<typeof createLogger>; //eslint-disable-line no-unused-private-class-members

  readonly name = 'LegacyCSSPlugin';

  constructor(options: LegacyCSSPluginOptions) {
    this.#logger = createLogger(this.name);
    this.#options = {
      cssBrowsersTarget: options?.cssBrowsersTarget ?? '>0.1%, ie 11',
      postcss: options?.postcss ?? (async config => config),
    };
  }

  async prepareConfigurations(
    configurations: ImaConfigurationContext[]
  ): Promise<ImaConfigurationContext[]> {
    // Enable CSS processing for legacy client bundle
    for (const configuration of configurations) {
      if (configuration.isClient) {
        configuration.processCss = true;
        configuration.outputFolders.css = 'static/css-legacy';
      }
    }

    return configurations;
  }

  async webpack(
    config: Configuration,
    ctx: ImaConfigurationContext
  ): Promise<Configuration> {
    if (!ctx.isClient) {
      return config;
    }

    const postcssRules = [
      ...findRules(config, 'test.less', 'postcss'),
      ...findRules(config, 'test.module.less', 'postcss'),
      ...findRules(config, 'test.css', 'postcss'),
      ...findRules(config, 'test.module.css', 'postcss'),
    ] as any[];

    for (const rule of postcssRules) {
      rule.options = await this.#options.postcss(rule.options, ctx);
      const presetEnv = rule.options.postcssOptions.plugins.find(
        (plugin: any) => {
          if (
            Array.isArray(plugin) &&
            plugin[0].includes('postcss-preset-env')
          ) {
            return plugin;
          }
        }
      );

      // Override preset env targets
      presetEnv[1].browsers = this.#options.cssBrowsersTarget;
    }

    return config;
  }
}

export { LegacyCSSPlugin };
