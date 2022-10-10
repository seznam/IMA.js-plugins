import { PageContext } from '@ima/core';
import React from 'react';

/**
 * Common sizer
 *
 * @namespace ima.ui.atom.sizer
 * @module ima.ui.atom
 */
export default class Sizer extends React.PureComponent {
  static get contextType() {
    return PageContext;
  }

  static get defaultProps() {
    return {
      width: 0,
      height: 0,
      placeholder: false,
      className: ''
    };
  }

  render() {
    let helper = this.context.$Utils.$UIComponentHelper;

    return (
      <div
        className={helper.cssClasses(
          {
            'atm-sizer': true,
            'atm-placeholder': this.props.placeholder
          },
          this.props.className
        )}
        style={{
          paddingTop: (this.props.height / this.props.width) * 100 + '%'
        }}
        {...helper.getEventProps(this.props)}
        {...helper.getDataProps(this.props)}
      />
    );
  }
}
