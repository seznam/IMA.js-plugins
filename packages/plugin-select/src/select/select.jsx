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

export default function select(...selectors) {
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
          this.context
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
        return <Component {...this.state} {...this.props} />;
      }
    }

    hoistStaticMethod(SelectState, Component);

    return SelectState;
  };
}

export function createStateSelector(...selectors) {
  const derivedState = createSelector(
    ...selectors.map(selector => {
      return (state, context) => {
        return selector(state, context);
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
