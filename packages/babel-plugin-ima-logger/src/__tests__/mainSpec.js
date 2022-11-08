import { transform } from '@babel/core';
import pluginFunction, { plugin } from '../main';

describe('main', () => {
  const PLUGIN_OPTIONS = { remove: true };
  const TRANSFORM_OPTIONS = {
    plugins: [[pluginFunction, PLUGIN_OPTIONS]]
  };
  const TRANSFORM_OPTIONS_DISABLED_REMOVING = {
    plugins: [[pluginFunction, { remove: false }]]
  };

  beforeEach(() => {
    jest.spyOn(plugin, '_error').mockImplementation(() => {});
  });

  describe('getPluginObject()', () => {
    ['throwIf', '(0, _imaPluginLogger.throwIf)'].forEach(func => {
      it(`should remove ${func}()`, () => {
        const { code } = transform(
          `foo();
					${func}(
						!arg || typeof arg !== 'string',
						new TypeError('Argument arg must be a string.')
					);
					bar();`,
          TRANSFORM_OPTIONS
        );
        expect(code).toMatchSnapshot();
      });
    });

    [
      'debug',
      'info',
      'log',
      'warn',
      '(0, _imaPluginLogger.debug)',
      '(0, _imaPluginLogger.info)',
      '(0, _imaPluginLogger.log)',
      '(0, _imaPluginLogger.warn)',
      '(0, _pluginLogger.debug)',
      '(0, _pluginLogger.info)',
      '(0, _pluginLogger.log)',
      '(0, _pluginLogger.warn)'
    ].forEach(func => {
      it(`should remove ${func}()`, () => {
        const { code } = transform(
          `foo();
					${func}('Argument arg must be a string.');
					bar();`,
          TRANSFORM_OPTIONS
        );
        expect(code).toMatchSnapshot();
      });
    });

    [
      'debugIf',
      'errorIf',
      'logIf',
      'infoIf',
      'warnIf',
      '(0, _imaPluginLogger.debugIf)',
      '(0, _imaPluginLogger.errorIf)',
      '(0, _imaPluginLogger.logIf)',
      '(0, _imaPluginLogger.infoIf)',
      '(0, _imaPluginLogger.warnIf)',
      '(0, _pluginLogger.debugIf)',
      '(0, _pluginLogger.errorIf)',
      '(0, _pluginLogger.logIf)',
      '(0, _pluginLogger.infoIf)',
      '(0, _pluginLogger.warnIf)'
    ].forEach(func => {
      it(`should replace ${func}() with 0`, () => {
        const { code } = transform(
          `foo();
				${func}(
					!arg || typeof arg !== 'string',
					new TypeError('Argument arg must be a string.')
				);
				bar();`,
          TRANSFORM_OPTIONS
        );
        expect(code).toMatchSnapshot();
      });

      it(`should replace ${func}() with 0 inside if`, () => {
        const { code } = transform(
          `foo();
					if (${func}(
						!arg || typeof arg !== 'string',
						new TypeError('Argument arg must be a string.')
					)) {
						// do something
					}
					bar();`,
          TRANSFORM_OPTIONS
        );
        expect(code).toMatchSnapshot();
      });
    });

    ['rejectIf', '(0, _imaPluginLogger.rejectIf)'].forEach(func => {
      it(`should replace ${func}() with 0 inside if`, () => {
        const { code } = transform(
          `function returingPromise() {
						let rejected;
						if (rejected = (${func}(
							!arg || typeof arg !== 'string',
							new TypeError('Argument arg must be a string.')
						))) {
							return rejected;
						}
						return asyncBar();
					}`,
          TRANSFORM_OPTIONS
        );
        expect(code).toMatchSnapshot();
      });
    });

    [
      'throwIf',
      'rejectIf',
      'debugIf',
      'errorIf',
      'logIf',
      'infoIf',
      'warnIf',
      '(0, _imaPluginLogger.throwIf)',
      '(0, _imaPluginLogger.rejectIf)',
      '(0, _imaPluginLogger.debugIf)',
      '(0, _imaPluginLogger.errorIf)',
      '(0, _imaPluginLogger.logIf)',
      '(0, _imaPluginLogger.infoIf)',
      '(0, _imaPluginLogger.warnIf)',
      '(0, _pluginLogger.throwIf)',
      '(0, _pluginLogger.rejectIf)',
      '(0, _pluginLogger.debugIf)',
      '(0, _pluginLogger.errorIf)',
      '(0, _pluginLogger.logIf)',
      '(0, _pluginLogger.infoIf)',
      '(0, _pluginLogger.warnIf)'
    ].forEach(func => {
      it(`should not remove ${func}() because removing is disabled by plugin options`, () => {
        const { code } = transform(
          `foo();
					${func}(
						!arg || typeof arg !== 'string',
						new TypeError('Argument arg must be a string.')
					);
					bar();`,
          TRANSFORM_OPTIONS_DISABLED_REMOVING
        );
        expect(code).toMatchSnapshot();
        expect(plugin._error).not.toHaveBeenCalled();
      });
    });

    [
      'debug',
      'info',
      'log',
      'warn',
      '(0, _imaPluginLogger.debug)',
      '(0, _imaPluginLogger.info)',
      '(0, _imaPluginLogger.log)',
      '(0, _imaPluginLogger.warn)',
      '(0, _pluginLogger.debug)',
      '(0, _pluginLogger.info)',
      '(0, _pluginLogger.log)',
      '(0, _pluginLogger.warn)'
    ].forEach(func => {
      it(`should not remove ${func}() because removing is disabled by plugin options`, () => {
        const { code } = transform(
          `foo();
					${func}('Argument arg must be a string.');
					bar();`,
          TRANSFORM_OPTIONS_DISABLED_REMOVING
        );
        expect(code).toMatchSnapshot();
      });
    });

    [
      'throwIf',
      'rejectIf',
      'debugIf',
      'errorIf',
      'logIf',
      'infoIf',
      'warnIf'
    ].forEach(method => {
      it(`should not remove instance.${method}()`, () => {
        const { code } = transform(
          `foo();
					instance.${method}(
						!arg || typeof arg !== 'string',
						new TypeError('Argument arg must be a string.')
					);
					bar();`,
          TRANSFORM_OPTIONS
        );
        expect(code).toMatchSnapshot();
        expect(plugin._error).not.toHaveBeenCalled();
      });
    });

    ['debug', 'error', 'info', 'log', 'warn'].forEach(method => {
      it(`should not remove instance.${method}()`, () => {
        const { code } = transform(
          `foo();
					instance.${method}('Argument arg must be a string.');
					bar();`,
          TRANSFORM_OPTIONS
        );
        expect(code).toMatchSnapshot();
      });
    });

    it(`should not remove error()`, () => {
      const { code } = transform(
        `foo();
				error('Argument arg must be a string.');
				bar();`,
        TRANSFORM_OPTIONS
      );
      expect(code).toMatchSnapshot();
    });

    it('should remove the whole import statement', () => {
      const { code } = transform(
        `import {
					debug,
					info,
					log,
					warn,
					throwIf,
					rejectIf,
					debugIf,
					errorIf,
					logIf,
					infoIf,
					warnIf
				} from '@ima/plugin-logger';
				foo();`,
        TRANSFORM_OPTIONS
      );
      expect(code).toMatchSnapshot();
      expect(plugin._error).not.toHaveBeenCalled();
    });

    it('should keep error() and isSilent() in the import statement', () => {
      const { code } = transform(
        `import {
					debug,
					error,
					info,
					log,
					warn,
					throwIf,
					rejectIf,
					debugIf,
					errorIf,
					isSilent,
					logIf,
					infoIf,
					warnIf
				} from '@ima/plugin-logger';
				foo();`,
        TRANSFORM_OPTIONS
      );
      expect(code).toMatchSnapshot();
      expect(plugin._error).not.toHaveBeenCalled();
    });

    it('should not remove the import statement for an unknown module', () => {
      const { code } = transform(
        `import { throwIf, errorIf } from 'bar';
				foo();`,
        TRANSFORM_OPTIONS
      );
      expect(code).toMatchSnapshot();
      expect(plugin._error).not.toHaveBeenCalled();
    });

    it('should not remove the import statement because removing is disabled by plugin options', () => {
      const { code } = transform(
        `import { throwIf, errorIf } from '@ima/plugin-logger';
				foo();`,
        TRANSFORM_OPTIONS_DISABLED_REMOVING
      );
      expect(code).toMatchSnapshot();
      expect(plugin._error).not.toHaveBeenCalled();
    });
  });

  describe('_shouldRemoveLogger', () => {
    it('should return true', () => {
      const should = plugin._shouldRemoveLogger(PLUGIN_OPTIONS);
      expect(should).toBeTruthy();
      expect(plugin._error).not.toHaveBeenCalled();
    });

    it('should return true, because argument environment = "prod"', () => {
      const should = plugin._shouldRemoveLogger({}, 'prod');
      expect(should).toBeTruthy();
      expect(plugin._error).not.toHaveBeenCalled();
    });

    it('should return false, because argument environment = "dev" or "test"', () => {
      const should = plugin._shouldRemoveLogger({}, 'dev');
      expect(should).toBeFalsy();
      const should2 = plugin._shouldRemoveLogger({}, 'test');
      expect(should2).toBeFalsy();
      expect(plugin._error).not.toHaveBeenCalled();
    });

    it('should log a type error and return false, because argument options is invalid', () => {
      const should = plugin._shouldRemoveLogger('invalidOptions');
      expect(plugin._error).toHaveBeenCalledWith(expect.any(TypeError));
      expect(should).toBeFalsy();
    });

    it('should log a type error and return false, because argument environment is invalid', () => {
      const should = plugin._shouldRemoveLogger(PLUGIN_OPTIONS, {});
      expect(plugin._error).toHaveBeenCalledWith(expect.any(TypeError));
      expect(should).toBeFalsy();
    });
  });
});
