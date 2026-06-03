import { aop as nativeAop, hookName, createHook, unAop } from 'to-aop';

let aopTargetsContainer = [];

/**
 * Extends default aop (from to-aop) behavior by saving the targets,
 * which can be cleared later with unAopAll function.
 *
 * @param {object | Function} target - The target object or function to apply AOP hooks to
 * @param {...any} args - Additional arguments passed to native aop function
 * @returns {any} Native aop return value
 */
function aop(target, ...args) {
  if (!aopTargetsContainer.includes(target)) {
    aopTargetsContainer.push(target);
  }

  return nativeAop(target, ...args);
}

/**
 * Clears aop hooks from all registered targets and resets the container.
 *
 * @returns {void}
 */
function unAopAll() {
  for (const target of aopTargetsContainer) {
    unAop(target);
  }

  aopTargetsContainer = [];
}

export { aop, hookName, createHook, unAopAll };
