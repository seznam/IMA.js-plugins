export default (ns, oc) => {
  const router = oc.get('$Router');
  const nativeRoute = router.route.bind(router);

  router.route = (path, ...args) => {
    // We have to set correct url in jsdom for first application
    // navigation to simulate browser behavior, where you
    // already have correct url set in address bar.
    if (!router._pageManager._managedPage.controller) {
      jsdom.reconfigure({
        url: router.getBaseUrl() + path
      });
    }

    return nativeRoute(path, ...args);
  };
};
