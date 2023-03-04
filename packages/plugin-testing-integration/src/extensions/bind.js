import { aop, hookName, createHook } from '../aop';

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
        /* eslint-disable-next-line no-undef */
        jsdom.reconfigure({
          url,
        });
      }
    }
  );

  aop(Router, routeHook);
};
