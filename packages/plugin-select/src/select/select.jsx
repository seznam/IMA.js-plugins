import { StateEvents, PageContext } from '@ima/core';
import hoistNonReactStaticMethod from 'hoist-non-react-statics';
import React, { useContext, useEffect, useState, useRef } from 'react';
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
  return Component => {
    const WithContext = props => {
      const [state] = useSelect(props, ...selectors);

      const { forwardedRef } = props;
      const restProps = Object.assign({}, props);

      if (forwardedRef) {
        delete restProps.forwardedRef;
      }

      return <Component {...restProps} {...state} ref={forwardedRef} />;
    };

    const componentName = Component.displayName || Component.name;
    WithContext.displayName = `withContext(${componentName})`;
    hoistStaticMethod(WithContext, Component);

    return WithContext;
  };
}

export function useSelect(props, ...selectors) {
  const context = useContext(PageContext);
  const utils = context.$Utils || props.$Utils;

  const currentProps = React.useRef(props);
  currentProps.current = props;

  const stateSelector = useRef(creatorOfStateSelector(...selectors));
  const resolveNewState = useRef(() => {
    return stateSelector.current(
      utils.$PageStateManager.getState(),
      context,
      currentProps.current
    );
  });

  const [state, setState] = useState(resolveNewState.current());

  const afterChangeState = useRef(() => {
    const newState = resolveNewState.current();

    if (newState !== state) {
      setState(newState);
    }
  });

  useEffect(() => {
    utils.$Dispatcher.listen(
      StateEvents.AFTER_CHANGE_STATE,
      afterChangeState.current
    );

    return function () {
      utils.$Dispatcher.unlisten(
        StateEvents.AFTER_CHANGE_STATE,
        afterChangeState.current
      );
    };
  }, []);

  return [resolveNewState.current()];
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
      if (
        Object.keys(state || {}).length !==
        Object.keys(memoizedState || {}).length
      ) {
        memoizedSelector = null;
        selectorFunctions = null;
      }
      memoizedState = state;

      if (!selectorFunctions) {
        selectorFunctions = Object.keys(state).map(key => {
          return currentState => {
            return currentState[key] === undefined ? false : currentState[key];
          };
        });
      }

      if (!memoizedSelector) {
        memoizedSelector = createSelector(...selectorFunctions, () => {
          return memoizedState;
        });
      }

      return memoizedSelector(state);
    };
  })();

  return createSelector(derivedState, passStateOnChange);
}
