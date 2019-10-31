/**
 * A default environment.
 *
 * @const {string} BabelLoggerPlugin~DEFAULT_ENVIRONMENT
 */
const DEFAULT_ENVIRONMENT = 'dev';

/**
 * BabelLoggerPlugin class removes functions of
 * {@link external:@usa/plugin-logger} when used in production or when the
 * plugin's `remove` option is set to `true`.
 */
class BabelLoggerPlugin {
  /**
   * Gets the plugin object itself.
   *
   * @see https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-writing-your-first-babel-plugin
   * @param {object} babel The current `babel` object.
   * @return {object} The plugin object.
   */
  getPluginObject({ types: t }) {
    if (!t) {
      this._error(
        new TypeError('The first argument must be the current babel object.')
      );

      return {};
    }

    return {
      visitor: {
        CallExpression: (path, state) => {
          if (!this._shouldRemoveLogger(state.opts)) {
            return;
          }

          const { callee } = path.node || {};

          if (
            !this._removeCallExpression(t, path, callee) &&
            callee.type === 'SequenceExpression' &&
            callee.expressions &&
            callee.expressions[1] &&
            callee.expressions[1].type === 'MemberExpression' &&
            ['_pluginLogger', '_imaPluginLogger'].includes(
              callee.expressions[1].object.name
            ) &&
            callee.expressions[1].property
          ) {
            // For vendor scripts.
            this._removeCallExpression(t, path, callee.expressions[1].property);
          }
        },

        ImportDeclaration: (path, state) => {
          if (!this._shouldRemoveLogger(state.opts)) {
            return;
          }

          const { value } = path.node.source || {};

          if (value && value === 'ima-plugin-logger') {
            path
              .get('specifiers')
              .filter(specifier => {
                const { type, imported } = specifier.node || {};

                return (
                  type === 'ImportSpecifier' &&
                  imported.type === 'Identifier' &&
                  [
                    'debug',
                    'info',
                    'log',
                    'warn',
                    'throwIf',
                    'rejectIf',
                    'debugIf',
                    'errorIf',
                    'logIf',
                    'infoIf',
                    'warnIf'
                  ].indexOf(imported.name) >= 0
                );
              })
              .forEach(specifier => specifier.remove());

            if (!path.node.specifiers.length) {
              path.remove();
            }
          }
        }
      }
    };
  }

  /**
   * Removes (or replaces with 0) the call expression if it should be removed.
   *
   * @param {object} t The babel-types object.
   * @param {object} path The AST path to be removed.
   * @param {object} node The AST node used to check if the call expression
   *        should be removed.
   * @return {boolean} `true` when the expression has been removed, otherwise
   *         `false`.
   */
  _removeCallExpression(t, path, node) {
    const { type, name } = node;

    if (
      type === 'Identifier' &&
      ['debug', 'info', 'log', 'throwIf', 'warn'].indexOf(name) >= 0
    ) {
      path.remove();

      return true;
    } else if (
      type === 'Identifier' &&
      ['rejectIf', 'errorIf', 'logIf', 'infoIf', 'warnIf', 'debugIf'].indexOf(
        name
      ) >= 0
    ) {
      path.replaceWith(t.numericLiteral(0));

      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if this plugin should remove logger statements.
   *
   * @param {Object.<string, *>} options The plugin options.
   * @param {string} [environment = process.env.NODE_ENV || DEFAULT_ENVIRONMENT]
   *        The environment.
   * @return {boolean} `true` when it should remove logger statements,
   *         otherwise `false`.
   */
  _shouldRemoveLogger(
    options,
    environment = process.env.NODE_ENV || DEFAULT_ENVIRONMENT
  ) {
    if (!options || typeof options !== 'object') {
      this._error(new TypeError('Argument options must be an object.'));

      return false;
    }

    if (!environment || typeof environment !== 'string') {
      this._error(new TypeError('Argument environment must be a string.'));

      return false;
    }

    if ('remove' in options) {
      return !!options.remove;
    } else {
      return ['prod', 'production'].indexOf(environment) >= 0;
    }
  }

  /**
   * Outputs an error message.
   *
   * @param {...*} message An error message.
   */
  _error(message) {
    console.error(...message);
  }
}

export const plugin = new BabelLoggerPlugin();
export default plugin.getPluginObject.bind(plugin);
