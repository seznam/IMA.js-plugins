import { PageContext } from '@ima/core';
import React from 'react';

/**
 * Common list
 *
 * @namespace ima.ui.atom.list
 * @module ima.ui.atom
 */

export default class List extends React.PureComponent {
  static get contextType() {
    return PageContext;
  }

  static get defaultProps() {
    return {
      className: '',
      mode: '',
      type: 'ul',
      style: null,
      'data-e2e': null
    };
  }

  render() {
    let helper = this.context.$Utils.$UIComponentHelper;
    let { type: Type, mode, id, className, children, style } = this.props;

    return (
      <Type
        style={style}
        className={helper.cssClasses(
          {
            'atm-list': true,
            ['atm-list-' + mode]: mode,
            ['atm-list-' + Type]: Type
          },
          className
        )}
        id={id}
        {...helper.getEventProps(this.props)}
        {...helper.getDataProps(this.props)}
        {...helper.getAriaProps(this.props)}>
        {children}
      </Type>
    );
  }
}
