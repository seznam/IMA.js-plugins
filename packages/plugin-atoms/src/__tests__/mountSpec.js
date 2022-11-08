import { PageContext } from '@ima/react-page-renderer';
import { mount } from 'enzyme';
import { toMockedInstance } from 'to-mock';
import classnames from 'classnames';

import * as UIAtoms from '../main';
import UIComponentHelper from '../UIComponentHelper';
import ComponentPositions from '../ComponentPositions';
import Visibility from '../Visibility';
import { Infinite } from 'infinite-circle';

import { JSDOM } from 'jsdom';
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

import _router from './mocks/router';
import _window from './mocks/window';
import _settings from './mocks/settings';

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};

const visibility = toMockedInstance(Visibility);
const mockPosition = {
  height: 0
};
const componentPositions = toMockedInstance(ComponentPositions, {
  getWindowViewportRect: () => mockPosition
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
    classnames,
    $Settings
  );

  const context = {
    $Utils: {
      $Settings,
      $UIComponentHelper
    }
  };
  const mountOptions = {
    context,
    someProp: true
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

  describe('should render atoms with noscript tag: ', () => {
    let mountOptions = getComponentOptions();

    it('should render Image with noscript tag', () => {
      const Component = UIAtoms.Image;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.jpg" />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(1);
    });

    it('should render Video with noscript tag', () => {
      const Component = UIAtoms.Video;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.mov" />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(1);
    });

    it('should render Iframe with noscript tag', () => {
      const Component = UIAtoms.Iframe;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.html" />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(1);
    });
  });

  describe('should render atoms without noscript tag - disabled by props: ', () => {
    let mountOptions = getComponentOptions();

    it('Image without noscript tag', () => {
      const Component = UIAtoms.Image;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.jpg" disableNoScript={true} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });

    it('Video without noscript tag', () => {
      const Component = UIAtoms.Video;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.mov" disableNoScript={true} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });

    it('Iframe without noscript tag', () => {
      const Component = UIAtoms.Iframe;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.html" disableNoScript={true} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });
  });

  describe('should render atoms without noscript tag - disabled by $Settings: ', () => {
    let mountOptions = getComponentOptions({
      plugin: {
        uiAtoms: {
          useIntersectionObserver: {
            iframes: true,
            images: true,
            videos: true
          },
          disableNoScript: {
            iframes: true,
            images: true,
            videos: true
          }
        }
      }
    });

    it('Image without noscript tag', () => {
      const Component = UIAtoms.Image;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.jpg" />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });
    it('Video without noscript tag', () => {
      const Component = UIAtoms.Video;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.mov" />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });

    it('Iframe without noscript tag', () => {
      const Component = UIAtoms.Iframe;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.html" />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });
  });

  describe('should render atoms with noscript tag - disabled by $Settings, overriden by props: ', () => {
    let mountOptions = getComponentOptions({
      plugin: {
        uiAtoms: {
          useIntersectionObserver: {
            iframes: true,
            images: true,
            videos: true
          },
          disableNoScript: {
            iframes: true,
            images: true,
            videos: true
          }
        }
      }
    });

    it('Image without noscript tag', () => {
      const Component = UIAtoms.Image;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.jpg" disableNoScript={false} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(1);
    });

    it('Video without noscript tag', () => {
      const Component = UIAtoms.Video;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.mov" disableNoScript={false} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(1);
    });

    it('Iframe without noscript tag', () => {
      const Component = UIAtoms.Iframe;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.html" disableNoScript={false} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(1);
    });
  });

  describe('should render atoms without noscript tag - enabled by $Settings, overriden by props: ', () => {
    let mountOptions = getComponentOptions({
      plugin: {
        uiAtoms: {
          useIntersectionObserver: {
            iframes: true,
            images: true,
            videos: true
          },
          disableNoScript: {
            iframes: false,
            images: false,
            videos: false
          }
        }
      }
    });

    it('Image without noscript tag', () => {
      const Component = UIAtoms.Image;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.jpg" disableNoScript={true} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });

    it('Video without noscript tag', () => {
      const Component = UIAtoms.Video;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.mov" disableNoScript={true} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });

    it('Iframe without noscript tag', () => {
      const Component = UIAtoms.Iframe;
      wrapper = mount(
        <PageContext.Provider value={mountOptions.context}>
          <Component src="example.html" disableNoScript={true} />
        </PageContext.Provider>,
        mountOptions
      );

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('noscript').length).toEqual(0);
    });
  });
});
