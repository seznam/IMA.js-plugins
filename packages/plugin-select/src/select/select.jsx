import {
  AbstractPureComponent,
  StateEvents,
  PageContext,
  getUtils
} from '@ima/core';
import hoistNonReactStaticMethod from 'hoist-non-react-statics';
import React, { useContext } from 'react';
import { createSelector } from 'reselect';

let creatorOfStateSelector = createStateSelector;
let hoistStaticMethod = hoistNonReactStaticMethod;

export function setCreatorOfStateSelector(createStateSelector) {
  creatorOfStateSelector = createStateSelector;
}

export const hoistNonReactStatic = hoistNonReactStaticMethod;

export function setHoistStaticMethod(method) {
  hoistStaticMethod = method;
}

export function select(...selectors) {
  const stateSelector = creatorOfStateSelector(...selectors);

  return Component => {
    const componentName = Component.displayName || Component.name;

    const WithContext = props => {
      const context = useContext(PageContext);

      return <SelectState {...props} context={context} />;
    };

    WithContext.displayName = `withContext(${componentName})`;

    class SelectState extends AbstractPureComponent {
      static getDerivedStateFromProps(props) {
        return SelectState.resolveNewState(props);
      }

      static resolveNewState(props) {
        const { context, ...restProps } = props;
        const utils = getUtils(restProps, context);

        return stateSelector(
          utils.$PageStateManager.getState(),
          context,
          restProps
        );
      }

      constructor(props, context) {
        super(props, context);

        this.state = SelectState.resolveNewState(props);
      }

      componentDidMount() {
        this.utils.$Dispatcher.listen(
          StateEvents.AFTER_CHANGE_STATE,
          this.afterChangeState,
          this
        );
      }

      componentWillUnmount() {
        this.utils.$Dispatcher.unlisten(
          StateEvents.AFTER_CHANGE_STATE,
          this.afterChangeState,
          this
        );
      }

      afterChangeState() {
        this.setState(SelectState.resolveNewState(this.props));
      }

      render() {
        const { forwardedRef } = this.props;
        const restProps = Object.assign({}, this.props);

        if (forwardedRef) {
          delete restProps.forwardedRef;
        }

        return <Component {...this.state} {...restProps} ref={forwardedRef} />;
      }
    }

    hoistStaticMethod(WithContext, Component);

    return WithContext;
  };
}

export default function forwardedSelect(...selectors) {
  return Component => {
    const SelectState = select(...selectors)(Component);
    const forwardRef = (props, ref) => {
      return <SelectState {...props} forwardedRef={ref} />;
    };
    const name = Component.displayName || Component.name;
    forwardRef.displayName = `select(${name})`;

    return React.forwardRef(forwardRef);
  };
}

export function createStateSelector(...selectors) {
  const derivedState = createSelector(
    ...selectors.map(selector => {
      return (state, context, props) => {
        return selector(state, context, props);
      };
    }),
    (...rest) => {
      return Object.assign({}, ...rest);
    }
  );

  const passStateOnChange = (() => {
    let memoizedSelector = null;
    let selectorFunctions = null;
    let memoizedState = null;

    return state => {
      memoizedState = state;
      if (!selectorFunctions) {
        selectorFunctions = Object.keys(state).map(key => {
          return currentState => {
            return currentState[key] || false;
          };
        });
      }

      if (!memoizedSelector) {
        memoizedSelector = createSelector(
          ...selectorFunctions,
          () => {
            return memoizedState;
          }
        );
      }

      return memoizedSelector(state);
    };
  })();

  return createSelector(
    derivedState,
    passStateOnChange
  );
}
