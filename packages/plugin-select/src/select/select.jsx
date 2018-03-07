import hoistNonReactStatic from 'hoist-non-react-statics';
import AbstractPureComponent from 'ima/page/AbstractPureComponent';
import * as helpers from 'ima/page/componentHelpers';
import React from 'react';
import { createSelector } from 'reselect';

export default function select(...selectors) {
	const stateSelector = createStateSelector(...selectors);

	return (Component) => {
		class SelectState extends AbstractPureComponent {
			static get contextTypes() {
				return helpers.getContextTypes(this);
			}

			constructor(props, context) {
				super(props, context);
			}

			render() {
				let extraProps = stateSelector(this);

				return <Component {...extraProps} {...this.props}/>;
			}
		}

		hoistNonReactStatic(SelectState, Component);

		return SelectState;
	};
}

export function createStateSelector(...selectors) {
	return createSelector(
		...(selectors.map((selector) => {
			return (componentInstance) => {
				if ($Debug) {
					if (!componentInstance ||
						!componentInstance.context ||
						!componentInstance.context.$Utils ||
						!componentInstance.context.$Utils.$PageStateManager
					) {
						throw new Error('The $PageStateManager must be added to $Utils in component context. The $Utils are defined in app/config/bind.js.');
					}
				}
				const state = componentInstance.context.$Utils.$PageStateManager.getState();

				return selector(state, componentInstance.context);
			}
		})),
		(...rest) => {
			return Object.assign({}, ...rest);
		}
	);
}
