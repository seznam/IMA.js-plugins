import { getContextValue, renderWithContext } from '@ima/testing-library';
import { PureComponent, createRef } from 'react';

import forwardedSelect, {
  createStateSelector,
  select,
  setCreatorOfStateSelector,
  setHoistStaticMethod,
  hoistNonReactStatic,
} from '../select';

describe('plugin-select:', () => {
  const appState = {
    media: {
      width: 90,
      height: 60,
    },
    title: 'title',
  };
  let componentContext;
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

  beforeEach(async () => {
    global.$Debug = true;
    componentContext = await getContextValue();

    jest
      .spyOn(componentContext.$Utils.$PageStateManager, 'getState')
      .mockReturnValue(appState);

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
        return <div>{JSON.stringify(this.props, null, 2)}</div>;
      }
    }

    it('should render component', async () => {
      const { container } = await renderWithContext(
        <Component {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render component with extraProps', async () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      const { container } = await renderWithContext(
        <EnhancedComponent {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render component with extraProps modifies by ownProps', async () => {
      let EnhancedComponent = select(
        ...selectorMethods,
        selectorUsingProps
      )(Component);

      const { container } = await renderWithContext(
        <EnhancedComponent {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render component with extraProps replaced by ownProps', async () => {
      let EnhancedComponent = select(
        ...selectorMethods,
        selectorReplaceProps
      )(Component);

      const { container } = await renderWithContext(
        <EnhancedComponent {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should add listener to dispatcher after mounting to DOM', async () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      jest.spyOn(componentContext.$Utils.$Dispatcher, 'listen');

      await renderWithContext(<EnhancedComponent {...defaultProps} />, {
        contextValue: componentContext,
      });

      expect(componentContext.$Utils.$Dispatcher.listen).toHaveBeenCalled();
    });

    it('should remove listener to dispatcher before unmounting from DOM', async () => {
      let EnhancedComponent = select(...selectorMethods)(Component);

      jest.spyOn(componentContext.$Utils.$Dispatcher, 'unlisten');

      const { unmount } = await renderWithContext(
        <EnhancedComponent {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      unmount();

      expect(componentContext.$Utils.$Dispatcher.unlisten).toHaveBeenCalled();
    });

    it('should render component with extraProps and own createStateSelector', async () => {
      setCreatorOfStateSelector((...selectors) => {
        return (state, context) => {
          return selectors.reduce((result, selector) => {
            return Object.assign({}, result, selector(state, context));
          }, {});
        };
      });
      let EnhancedComponent = select(...selectorMethods)(Component);

      const { container } = await renderWithContext(
        <EnhancedComponent {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render component with changed props', async () => {
      let EnhancedComponent = select(selectorUsingProps)(Component);

      const { container, rerender } = await renderWithContext(
        <EnhancedComponent {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      rerender(<EnhancedComponent {...defaultProps} multiplier={3} />);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render component with extraProps and own static methods', async () => {
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

      const { container } = await renderWithContext(
        <EnhancedComponent {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      expect(typeof EnhancedComponent.myCustom === 'function').toBeTruthy();
      expect(typeof EnhancedComponent.defaultProps === 'function').toBeTruthy();
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should forward ref', async () => {
      let EnhancedComponent = forwardedSelect(...selectorMethods)(Component);
      const componentRef = createRef();

      const { container } = await renderWithContext(
        <EnhancedComponent {...defaultProps} ref={componentRef} />,
        {
          contextValue: componentContext,
        }
      );

      expect(componentRef.current).toBeInstanceOf(Component);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render component with extraProps and own static methods for forwardedSelect', async () => {
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
      let EnhancedComponent = forwardedSelect(...selectorMethods)(Component);

      const { container } = await renderWithContext(
        <EnhancedComponent {...defaultProps} />,
        {
          contextValue: componentContext,
        }
      );

      expect(typeof EnhancedComponent.myCustom === 'function').toBeTruthy();
      expect(typeof EnhancedComponent.defaultProps === 'function').toBeTruthy();
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
