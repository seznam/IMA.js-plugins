import { aop as nativeAop, hookName, createHook, unAop } from 'to-aop';

let aopTargetsContainer = [];

/**
 * Extends default aop (from to-aop) behavior by saving the targets,
 * which can be cleared later with unAopAll function.
 * @param {Object|Function} target
 * @param  {...any} args
 */
function aop(target, ...args) {
  if (!aopTargetsContainer.includes(target)) {
    aopTargetsContainer.push(target);
  }

  return nativeAop(target, ...args);
}

/**
 * Clears aop hooks from all targets.
 */
function unAopAll() {
  for (const target of aopTargetsContainer) {
    unAop(target);
  }

  aopTargetsContainer = [];
}

export { aop, hookName, createHook, unAopAll };
