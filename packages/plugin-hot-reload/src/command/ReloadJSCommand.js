import {
  Router,
  PageManager,
  PageRenderer,
  Dispatcher,
  EventBus
} from '@ima/core';
import { WebSocket } from '@ima/plugin-websocket';
import Command from './Command';

export default class ReloadJSCommand extends Command {
  static get $dependencies() {
    return [Router, PageManager, PageRenderer, Dispatcher, EventBus, WebSocket];
  }

  constructor(
    router,
    pageManager,
    pageRenderer,
    dispatcher,
    eventBus,
    webSocket
  ) {
    super();

    /**
     * @type {Router}
     */
    this._router = router;

    /**
     * @type {PageManager}
     */
    this._pageManager = pageManager;

    /**
     * @type {PageRenderer}
     */
    this._pageRenderer = pageRenderer;

    /**
     * @type {Dispatchet}
     */
    this._dispatcher = dispatcher;

    /**
     * @type {EventBus}
     */
    this._eventBus = eventBus;

    /**
     * @type {WebSocket}
     */
    this._webSocket = webSocket;
  }

  async execute(payload) {
    //this._dispatcher.fire();

    this._destroyOldIMAInstance();

    try {
      await this._replaceSourceCode(payload.contents);

      await this._createNewIMAInstance();
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }

  _destroyOldIMAInstance() {
    this._webSocket.destroy();

    this._router.unlisten();
    this._eventBus.unlistenAll();
    this._pageManager.destroy();
    this._pageRenderer.unmount();
    this._dispatcher.clear();
  }

  async _replaceSourceCode(content) {
    (0, eval)(content);

    await $IMA.Loader.initAllModules();
  }

  async _createNewIMAInstance() {
    if (!$Debug) {
      return;
    }

    const [appMain, ima] = await Promise.all([
      $IMA.Loader.import('app/main'),
      $IMA.Loader.import('@ima/core')
    ]);

    let app = ima.createImaApp();
    let bootConfig = ima.getClientBootConfig(
      appMain.getInitialAppConfigFunctions()
    );
    app = ima.bootClientApp(app, bootConfig);

    let router = app.oc.get('$Router');
    let pageManager = app.oc.get('$PageManager');
    let currentRouteInfo = router.getCurrentRouteInfo();
    let currentRoute = currentRouteInfo.route;
    let currentRouteOptions = Object.assign({}, currentRoute.getOptions(), {
      onlyUpdate: false,
      autoScroll: false,
      allowSPA: false
    });

    router.listen();

    try {
      return pageManager
        .manage(currentRoute, currentRouteOptions, currentRouteInfo.params)
        .catch((error) => {
          return router.handleError({ error });
        })
        .catch((error) => {
          if (typeof $IMA.fatalErrorHandler === 'function') {
            $IMA.fatalErrorHandler(error);
          } else {
            console.warn(
              'Define the config.$IMA.fatalErrorHandler function ' +
                'in services.js.'
            );
          }
        });
    } catch (error) {
      return router.handleError({ error });
    }
  }
}
