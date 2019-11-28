import { PageStateManager, Dispatcher } from '@ima/core';
import { shallow } from 'enzyme';
import React from 'react';
import { toMockedInstance, setGlobalMockMethod } from 'to-mock';
import forwardedSelect, {
  createStateSelector,
  select,
  setCreatorOfStateSelector,
  setHoistStaticMethod,
  hoistNonReactStatic
} from '../select';

setGlobalMockMethod(jest.fn);

describe('plugin-select:', () => {
  const appState = {
    media: {
      width: 90,
      height: 60
    },
    title: 'title'
  };
  const componentContext = {
    $Utils: {
      $PageStateManager: toMockedInstance(PageStateManager, {
        getState: () => {
          return appState;
        }
      }),
      $Dispatcher: toMockedInstance(Dispatcher)
    }
  };
  const selectorMethods = [
    state => {
      return {
        width: state.media.width
      };
    },
    state => {
      return {
        height: state.media.height
      };
    }
  ];

  const selectorUsingProps = (state, context, props) => ({
    width: state.media.width * props.multiplier,
    height: state.media.height * props.multiplier
  });

  beforeEach(() => {
    global.$Debug = true;
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
      multiplier: 0.5
    };

    class Component extends React.PureComponent {
      static defaultProps() {
        return defaultProps;
      }

      render() {
        return <h1>text</h1>;
      }
    }

    it('should render component', () => {
      wrapper = shallow(React.createElement(Component, defaultProps), {
        context: componentContext
      });

      expect(wrapper).toMatchSnapshot();
    });

    it.skip('should render component with extraProps', () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = shallow(React.createElement(EnhancedComponent, defaultProps), {
        context: componentContext
      });

      expect(wrapper).toMatchSnapshot();
    });

    it.skip('should render component with extraProps modifies by ownProps', () => {
      let EnhancedComponent = select(
        ...selectorMethods,
        selectorUsingProps
      )(Component);

      wrapper = shallow(React.createElement(EnhancedComponent, defaultProps), {
        context: componentContext
      });

      expect(wrapper).toMatchSnapshot();
    });

    it.skip('should add listener to dispatcher after mounting to DOM', () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = shallow(React.createElement(EnhancedComponent, defaultProps), {
        context: componentContext
      });

      wrapper.instance().componentDidMount();

      expect(componentContext.$Utils.$Dispatcher.listen).toHaveBeenCalled();
    });

    it.skip('should remove listener to dispatcher before unmounting from DOM', () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = shallow(React.createElement(EnhancedComponent, defaultProps), {
        context: componentContext
      });

      wrapper.instance().componentWillUnmount();

      expect(componentContext.$Utils.$Dispatcher.unlisten).toHaveBeenCalled();
    });

    it.skip('should render component with extraProps and own createStateSelector', () => {
      setCreatorOfStateSelector((...selectors) => {
        return (state, context) => {
          return selectors.reduce((result, selector) => {
            return Object.assign({}, result, selector(state, context));
          }, {});
        };
      });
      let EnhancedComponent = select(...selectorMethods)(Component);

      wrapper = shallow(React.createElement(EnhancedComponent, defaultProps), {
        context: componentContext
      });

      expect(wrapper).toMatchSnapshot();
    });

    it.skip('should render component with extraProps and own static methods', () => {
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

      wrapper = shallow(React.createElement(EnhancedComponent, defaultProps), {
        context: componentContext
      });

      expect(typeof EnhancedComponent.defaultProps === 'function').toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });

    it.skip('should remove forwardedRef prop (replaces it with ref)', () => {
      let EnhancedComponent = select(...selectorMethods)(Component);
      let props = Object.assign({}, defaultProps, {
        forwardedRef: React.createRef()
      });

      wrapper = shallow(React.createElement(EnhancedComponent, props), {
        context: componentContext
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should forward ref', () => {
      let EnhancedComponent = forwardedSelect(...selectorMethods)(Component);
      let props = Object.assign({}, defaultProps, {
        ref: React.createRef()
      });

      wrapper = shallow(React.createElement(EnhancedComponent, props), {
        context: componentContext
      });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
