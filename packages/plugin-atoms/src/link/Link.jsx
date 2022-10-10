import { PageContext } from '@ima/core';
import React from 'react';

/**
 * Common link
 *
 * @namespace ima.ui.atom.link
 * @module ima.ui.atom
 */

export default class Link extends React.PureComponent {
  static get contextType() {
    return PageContext;
  }

  static get defaultProps() {
    return {
      text: null,
      mode: '',
      style: null,
      rel: null,
      className: '',
      'data-e2e': null
    };
  }

  render() {
    let helper = this.context.$Utils.$UIComponentHelper;
    let {
      href,
      title,
      target,
      mode,
      className,
      id,
      children,
      text,
      style,
      rel
    } = this.props;

    return (
      <a
        href={href}
        title={title}
        target={target}
        style={style}
        rel={rel}
        id={id}
        className={helper.cssClasses(
          {
            'atm-link': true,
            ['atm-link-' + mode]: mode
          },
          className
        )}
        {...helper.getEventProps(this.props)}
        {...helper.getDataProps(this.props)}
        {...helper.getAriaProps(this.props)}>
        {children || text}
      </a>
    );
  }
}
