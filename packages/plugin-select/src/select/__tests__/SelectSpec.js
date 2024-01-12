import { PageStateManager, Dispatcher } from '@ima/core';
import { PageContext } from '@ima/react-page-renderer';
import { shallow, mount } from 'enzyme';
import { PureComponent, createElement, createRef } from 'react';
import { toMockedInstance, setGlobalMockMethod } from 'to-mock';

import forwardedSelect, {
  createStateSelector,
  select,
  setCreatorOfStateSelector,
  setHoistStaticMethod,
  hoistNonReactStatic,
} from '../select';

setGlobalMockMethod(jest.fn);

describe('plugin-select:', () => {
  const appState = {
    media: {
      width: 90,
      height: 60,
    },
    title: 'title',
  };
  const componentContext = {
    $Utils: {
      $PageStateManager: toMockedInstance(PageStateManager, {
        getState: () => {
          return appState;
        },
      }),
      $Dispatcher: toMockedInstance(Dispatcher),
    },
  };
  const selectorMethods = [
    state => {
      return {
        width: state.media.width,
      };
    },
    state => {
      return {
        height: state.media.height,
      };
    },
    state => {
      if (!state.dynamic) {
        return undefined;
      }

      return {
        dynamic: state.dynamic,
      };
    },
  ];

  const selectorUsingProps = (state, context, props) => ({
    width: state.media.width * props.multiplier,
    height: state.media.height * props.multiplier,
  });

  const selectorReplaceProps = (state, context, props) => ({
    multiplier: props.multiplier * props.multiplier,
    settings: Object.assign({}, props.settings, { newSettingsProp: true }),
  });

  beforeEach(() => {
    global.$Debug = true;

    setCreatorOfStateSelector(createStateSelector);
  });

  afterEach(() => {
    delete global.$Debug;
  });

  describe('createStateSelector', () => {
    it('should select extra properties from state', () => {
      let extraProps = createStateSelector(...selectorMethods)(
        appState,
        componentContext
      );

      expect(extraProps).toMatchSnapshot();
    });

    it('should return same output for same input', () => {
      let selector = createStateSelector(...selectorMethods);

      let obj1 = selector(appState, componentContext);
      let obj2 = selector(appState, componentContext);

      expect(obj1 === obj2).toBeTruthy();
    });

    it('should return same output for cloned input with same values', () => {
      let selector = createStateSelector(...selectorMethods);

      let obj1 = selector(appState, componentContext);
      let obj2 = selector({ ...appState }, componentContext);

      expect(obj1 === obj2).toBeTruthy();
    });

    it('should return same output for dynamic changing state selector keys with same values', () => {
      let selector = createStateSelector(...selectorMethods);

      let obj1 = selector(appState, componentContext);
      let obj2 = selector({ ...appState, dynamic: 1 }, componentContext);
      let obj3 = selector({ ...appState, dynamic: 1 }, componentContext);
      let obj4 = selector(appState, componentContext);

      expect(obj1 === obj2).toBeFalsy();
      expect(obj2 === obj3).toBeTruthy();
      expect(obj1 === obj4).toBeFalsy();
      expect(obj1).toMatchSnapshot();
      expect(obj2).toMatchSnapshot();
      expect(obj3).toMatchSnapshot();
      expect(obj4).toMatchSnapshot();
    });

    it('should trow error for undefined $PageStateManager', () => {
      expect(() => {
        createStateSelector(...selectorMethods)({ context: { $Utils: {} } });
      }).toThrow();
    });
  });

  describe('select', () => {
    let wrapper = null;
    const defaultProps = {
      props: 'props',
      multiplier: 0.5,
      settings: {
        color: 'red',
      },
    };

    class Component extends PureComponent {
      static defaultProps() {
        return defaultProps;
      }

      static myCustom() {
        return 1;
      }

      render() {
        return <h1>text</h1>;
      }
    }

    const MockContextProvider = ({ children }) => (
      <PageContext.Provider value={componentContext}>
        {children}
      </PageContext.Provider>
    );

    it('should render component', () => {
      wrapper = shallow(createElement(Component, defaultProps), {
        context: componentContext,
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render component with extraProps', () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render component with extraProps modifies by ownProps', () => {
      let EnhancedComponent = select(
        ...selectorMethods,
        selectorUsingProps
      )(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render component with extraProps replaced by ownProps', () => {
      let EnhancedComponent = select(
        ...selectorMethods,
        selectorReplaceProps
      )(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should add listener to dispatcher after mounting to DOM', () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      expect(componentContext.$Utils.$Dispatcher.listen).toHaveBeenCalled();
    });

    it('should remove listener to dispatcher before unmounting from DOM', () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      wrapper.unmount();

      expect(componentContext.$Utils.$Dispatcher.unlisten).toHaveBeenCalled();
    });

    it('should render component with extraProps and own createStateSelector', () => {
      setCreatorOfStateSelector((...selectors) => {
        return (state, context) => {
          return selectors.reduce((result, selector) => {
            return Object.assign({}, result, selector(state, context));
          }, {});
        };
      });
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render component with changed props', () => {
      let EnhancedComponent = select(selectorUsingProps)(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      wrapper.setProps({ multiplier: 3 });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render component with extraProps and own static methods', () => {
      setHoistStaticMethod((TargetComponent, Original) => {
        const keys = Object.getOwnPropertyNames(Original);

        keys.forEach(key => {
          if (key === 'defaultProps') {
            const descriptor = Object.getOwnPropertyDescriptor(Original, key);
            try {
              Object.defineProperty(TargetComponent, key, descriptor);
            } catch (e) {} // eslint-disable-line no-empty
          }
        });

        return hoistNonReactStatic(TargetComponent, Original);
      });
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      expect(typeof EnhancedComponent.myCustom === 'function').toBeTruthy();
      expect(typeof EnhancedComponent.defaultProps === 'function').toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });

    it('should forward ref', () => {
      let EnhancedComponent = forwardedSelect(...selectorMethods)(Component);

      wrapper = shallow(
        createElement(EnhancedComponent, {
          ...defaultProps,
          ref: createRef(),
        }),
        {
          context: componentContext,
        }
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should render component with extraProps and own static methods for forwardedSelect', () => {
      setHoistStaticMethod((TargetComponent, Original) => {
        const keys = Object.getOwnPropertyNames(Original);

        keys.forEach(key => {
          if (key === 'defaultProps') {
            const descriptor = Object.getOwnPropertyDescriptor(Original, key);
            try {
              Object.defineProperty(TargetComponent, key, descriptor);
            } catch (e) { } // eslint-disable-line no-empty
          }
        });

        return hoistNonReactStatic(TargetComponent, Original);
      });
      let EnhancedComponent = forwardedSelect(...selectorMethods)(Component);

      wrapper = mount(createElement(EnhancedComponent, defaultProps), {
        context: componentContext,
        wrappingComponent: MockContextProvider,
      });

      expect(typeof EnhancedComponent.myCustom === 'function').toBeTruthy();
      expect(typeof EnhancedComponent.defaultProps === 'function').toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
