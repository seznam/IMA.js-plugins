import * as logger from '../main';

describe('ima-plugin-logger', () => {
  const ERROR = new Error('foo');
  const MESSAGES = ['foo', ERROR, 1, { bar: 1 }, true, null];
  const TRUTHY_CONDITION = 1 !== 2;
  const FALSY_CONDITION = 1 !== 1;

  describe('export', () => {
    it('should export all components', () => {
      expect(logger).toMatchSnapshot();
    });
  });

  describe('enable/disable a silentMode', () => {
    beforeEach(() => {
      logger.configureLogger({
        silentMode: false
      });
    });

    it('should return false', () => {
      expect(logger.isSilent()).toBeFalsy();
    });

    it('should return true', () => {
      logger.configureLogger({ silentMode: true });
      expect(logger.isSilent()).toBeTruthy();
    });

    it('should return false because silentMode has been disabled again', () => {
      logger.configureLogger({ silentMode: true });
      logger.configureLogger({ silentMode: false });
      expect(logger.isSilent()).toBeFalsy();
    });

    it('should return true because beSilent() has been called', () => {
      logger.beSilent();
      expect(logger.isSilent()).toBeTruthy();
    });

    it('should log a type error because argument config is invalid', () => {
      spyOn(logger, 'error');
      logger.configureLogger(1);
      expect(logger.error).toHaveBeenCalledWith(expect.any(TypeError));
    });
  });

  ['log', 'info', 'warn', 'error', 'debug'].forEach(method => {
    describe(`${method}()`, () => {
      beforeEach(() => {
        spyOn(console, method);
      });

      it(`should call console.${method}()`, () => {
        spyOn(logger, 'isSilent').and.returnValue(false);
        logger[method](...MESSAGES);
				expect(console[method]).toHaveBeenCalledWith(...MESSAGES); // eslint-disable-line
      });

      it(`should not call console.${method}()`, () => {
        spyOn(logger, 'isSilent').and.returnValue(true);
        logger[method](...MESSAGES);
				expect(console[method]).not.toHaveBeenCalled(); // eslint-disable-line
      });
    });
  });

  Object.entries({
    logIf: 'log',
    infoIf: 'info',
    warnIf: 'warn',
    errorIf: 'error'
  }).forEach(([method, calledMethod]) => {
    describe(`${method}()`, () => {
      beforeEach(() => {
        spyOn(logger, calledMethod);
      });

      it(`should call ${calledMethod}()`, () => {
        const result = logger[method](TRUTHY_CONDITION, MESSAGES);
        expect(logger[calledMethod]).toHaveBeenCalledWith(MESSAGES);
        expect(result).toBeTruthy();
      });

      it(`should not call ${calledMethod}() because the condition is falsy`, () => {
        const result = logger[method](FALSY_CONDITION, MESSAGES);
        expect(logger[calledMethod]).not.toHaveBeenCalled();
        expect(result).toBeFalsy();
      });
    });
  });

  describe('throwIf()', () => {
    it('should throw ERROR', () => {
      expect(() => {
        logger.throwIf(TRUTHY_CONDITION, ERROR);
      }).toThrowError(ERROR);
    });

    it('should not throw an error because the condition is falsy', () => {
      expect(() => {
        logger.throwIf(FALSY_CONDITION, ERROR);
      }).not.toThrowError();
    });
  });

  describe('rejectIf()', () => {
    it('should return a rejected promise', async done => {
      try {
        await logger.rejectIf(TRUTHY_CONDITION, ERROR);
        done.fail();
      } catch (error) {
        expect(error).toEqual(ERROR);
        done();
      }
    });

    it('should return null because the condition is falsy', () => {
      const result = logger.rejectIf(FALSY_CONDITION, ERROR);
      expect(result).toBeNull();
    });
  });
});
