import { PageContext } from '@ima/react-page-renderer';
import { PureComponent } from 'react';

/**
 * Common paragraph
 *
 * @namespace ima.ui.atom.paragraph
 * @module ima.ui.atom
 */

export default class Paragraph extends PureComponent {
  static get contextType() {
    return PageContext;
  }

  static get defaultProps() {
    return {
      className: '',
      text: null,
      mode: '',
      style: null,
      'data-e2e': null
    };
  }

  render() {
    let helper = this.context.$Utils.$UIComponentHelper;
    let { mode, align, className, children, text, style } = this.props;
    let paragraph = null;
    let componentClassName = helper.cssClasses(
      {
        'atm-paragraph': true,
        ['atm-paragraph-' + mode]: mode,
        ['atm-paragraph-align-' + align]: align
      },
      className
    );

    if (children) {
      paragraph = (
        <p
          style={style}
          className={componentClassName}
          {...helper.getEventProps(this.props)}
          {...helper.getDataProps(this.props)}
          {...helper.getAriaProps(this.props)}>
          {children}
        </p>
      );
    } else {
      paragraph = (
        <p
          style={style}
          className={componentClassName}
          {...helper.getEventProps(this.props)}
          {...helper.getDataProps(this.props)}
          {...helper.getAriaProps(this.props)}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }

    return paragraph;
  }
}
