const {
  ClientPageRenderer,
  PageRenderer,
  PageRendererFactory,
  Window,
} = require('@ima/core');
const { mount } = require('enzyme');
const ReactDOM = require('react-dom');

class EnzymeReactDOM {
  constructor() {
    this._instances = [];
  }

  get __instances() {
    return this._instances;
  }

  render(element, container, callback = () => {}) {
    this.unmountComponentAtNode(container);

    const wrapper = mount(element, { attachTo: container });

    this._instances.push({ container, wrapper });

    callback();

    return wrapper;
  }

  hydrate(element, container, callback = () => {}) {
    this._dropInstanceAtNode(container);

    const wrapper = mount(element, { hydrateIn: container });

    this._instances.push({ container, wrapper });

    callback();

    return wrapper;
  }

  unmountComponentAtNode(container) {
    const instance = this._dropInstanceAtNode(container);

    if (!instance) {
      return false;
    }

    instance.wrapper.detach();

    return true;
  }

  findDOMNode(...args) {
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(...args);
  }

  createPortal(...args) {
    return ReactDOM.createPortal(...args);
  }

  _dropInstanceAtNode(container) {
    const instanceIndex = this._getInstanceContainerIndex(container);

    if (!~instanceIndex) {
      return null;
    }

    const instance = this._instances[instanceIndex];

    this._instances.splice(instanceIndex, 1);

    return instance;
  }

  _getInstanceContainerIndex(container) {
    return this._instances.findIndex(
      instance => instance.container === container
    );
  }
}

class EnzymePageRenderer extends ClientPageRenderer {
  static initTestPageRenderer(ns, oc) {
    oc.provide(PageRenderer, EnzymePageRenderer, [
      PageRendererFactory,
      '$Helper',
      '$ReactDOM',
      '$Dispatcher',
      '$Settings',
      Window,
    ]);

    return { wrapper: () => oc.get(PageRenderer).__wrapper() };
  }

  constructor(...args) {
    super(...args);

    this._ReactDOM = new EnzymeReactDOM(this._viewContainer);
  }

  __wrapper() {
    if (this._ReactDOM.__instances.length === 0) {
      return null;
    }

    if (this._ReactDOM.__instances.length === 1) {
      return this._ReactDOM.__instances[0].wrapper;
    }

    return this._ReactDOM.__instances.map(({ wrapper }) => wrapper);
  }
}

module.exports = EnzymePageRenderer;
