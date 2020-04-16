export default (ns, oc) => {
  const pageManager = oc.get('$PageManager');
  const router = oc.get('$Router');
  const nativeRoute = router.route.bind(router);

  router.route = (path, ...args) => {
    const isFirstNavigation = !pageManager._managedPage.controller;

    // We have to set correct url in jsdom for first application
    // navigation to simulate browser behavior, where you
    // already have correct url set in address bar.
    if (isFirstNavigation) {
      jsdom.reconfigure({
        url: router.getBaseUrl() + path
      });
    }

    return nativeRoute(path, ...args);
  };
};
