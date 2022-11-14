import { PageContext } from '@ima/react-page-renderer';
import { PureComponent } from 'react';

/**
 * Base headline
 *
 * @namespace ima.ui.atom.headline
 * @module ima.ui.atom
 */
export default class Headline extends PureComponent {
  static get contextType() {
    return PageContext;
  }

  static get defaultProps() {
    return {
      id: null,
      className: '',
      html: null,
      mode: null,
      type: 'h1',
      style: null,
      'data-e2e': null,
    };
  }

  render() {
    let headline = null;
    let { type: Type, id, mode, html, className, children, style } = this.props;
    let helper = this.context.$Utils.$UIComponentHelper;
    let computedClassName = helper.cssClasses(
      {
        ['atm-headline']: true,
        ['atm-' + mode]: mode,
        ['atm-' + Type]: Type,
      },
      className
    );

    if (children) {
      headline = (
        <Type
          id={id}
          style={style}
          className={computedClassName}
          {...helper.getEventProps(this.props)}
          {...helper.getDataProps(this.props)}
          {...helper.getAriaProps(this.props)}
        >
          {children}
        </Type>
      );
    } else {
      headline = (
        <Type
          id={id}
          style={style}
          className={computedClassName}
          {...helper.getEventProps(this.props)}
          {...helper.getDataProps(this.props)}
          {...helper.getAriaProps(this.props)}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return headline;
  }
}
