import { aop, createHook, hookName, unAopAll } from '../aop';

describe('AOP', () => {
  it('can clear all aop hooks with unAopAll', () => {
    const hookFn = jest.fn();
    class A {
      static method() {}
    }

    const hook = createHook(
      hookName.beforeMethod,
      'method',
      ({ args, context }) => hookFn(args, context)
    );

    aop(A, hook);
    A.method();

    expect(hookFn).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    unAopAll();
    A.method();

    expect(hookFn).not.toHaveBeenCalled();
  });
});
