import { PageContext } from '@ima/react-page-renderer';
import classnames from 'classnames';
import { mount } from 'enzyme';
import { Infinite } from 'infinite-circle';
import { JSDOM } from 'jsdom';
import { toMockedInstance } from 'to-mock';

import _router from './mocks/router';
import _settings from './mocks/settings';
import _window from './mocks/window';
import ComponentPositions from '../ComponentPositions';
import * as UIAtoms from '../main';
import UIComponentHelper from '../UIComponentHelper';
// eslint-disable-next-line import/order
import Visibility from '../Visibility';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

const visibility = toMockedInstance(Visibility);
const mockPosition = {
  height: 0,
};
const componentPositions = toMockedInstance(ComponentPositions, {
  getWindowViewportRect: () => mockPosition,
});
const infinite = toMockedInstance(Infinite);

function getComponentOptions(overrideSettings = {}) {
  const $Settings = Object.assign({}, _settings, overrideSettings);

  const $UIComponentHelper = new UIComponentHelper(
    _router,
    _window,
    componentPositions,
    visibility,
    infinite,
    classnames
  );

  const context = {
    $Utils: {
      $Settings,
      $UIComponentHelper,
      $CssClasses: classnames,
    },
  };
  const mountOptions = {
    context,
    someProp: true,
  };

  return mountOptions;
}

describe('UIAtoms mount rendering', () => {
  let wrapper = null;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('should render atoms without noscript tag: ', () => {
    let mountOptions = getComponentOptions();

    it('should render Image without noscript tag', () => {
      const Component = UIAtoms.Image;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src='example.jpg' />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript')).toHaveLength(0);
    });

    it('should render Iframe without noscript tag', () => {
      const Component = UIAtoms.Iframe;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src='example.html' />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript')).toHaveLength(0);
    });
  });
});
