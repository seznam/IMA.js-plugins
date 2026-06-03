import { aop, hookName, createHook } from '../aop';

/**
 * Initializes AOP hook for Router to update JSDOM URL on first navigation.
 * This simulates browser behavior where the URL is already set in the address bar.
 *
 * @param {import('@ima/core').Namespace} ns - IMA.js namespace
 * @param {import('@ima/core').ObjectContainer} oc - IMA.js object container
 * @returns {void}
 */
export default (ns, oc) => {
  const Router = oc.get('$Router').constructor;
  const routeHook = createHook(
    hookName.beforeMethod,
    'route',
    ({ args, context }) => {
      const pageManager = oc.get('$PageManager');
      const isFirstNavigation = !pageManager._managedPage.controller;
      const path = args[0];

      // We have to set correct url in jsdom for first application
      // navigation to simulate browser behavior, where you
      // already have correct url set in address bar.
      if (isFirstNavigation) {
        const url = context.getBaseUrl() + path;

        if (typeof globalThis.jsdom !== 'undefined') {
          // Legacy: global.jsdom was explicitly set (old initJSDom flow)
          globalThis.jsdom.reconfigure({ url });
        } else {
          // jest-environment-jsdom: use history API to update location
          window.history.replaceState(null, '', url);
        }
      }
    }
  );

  aop(Router, routeHook);
};
