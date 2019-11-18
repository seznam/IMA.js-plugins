import hoistNonReactStaticMethod from 'hoist-non-react-statics';
import AbstractPureComponent from 'ima/page/AbstractPureComponent';
import Events from 'ima/page/state/Events';
import * as helpers from 'ima/page/componentHelpers';
import React from 'react';
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
    class SelectState extends AbstractPureComponent {
      static get contextTypes() {
        return helpers.getContextTypes(this);
      }

      constructor(props, context) {
        super(props, context);

        this.stateSelector = creatorOfStateSelector(...selectors);
        this.state = this._resolveNewState();
      }

      _resolveNewState() {
        return this.stateSelector(
          this.utils.$PageStateManager.getState(),
          this.context,
          this.props
        );
      }

      componentDidMount() {
        this.utils.$Dispatcher.listen(
          Events.AFTER_CHANGE_STATE,
          this.afterChangeState,
          this
        );
      }

      componentWillUnmount() {
        this.utils.$Dispatcher.unlisten(
          Events.AFTER_CHANGE_STATE,
          this.afterChangeState,
          this
        );
      }

      afterChangeState() {
        this.setState(this._resolveNewState());
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

    hoistStaticMethod(SelectState, Component);

    return SelectState;
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
