import { PageContext } from '@ima/react-page-renderer';
import { PureComponent } from 'react';

import AmpImage from './AmpImage';
import HtmlImage from './HtmlImage';

/**
 * Common image
 *
 * @namespace ima.ui.atom.image
 * @module ima.ui.atom
 */

export default class Image extends PureComponent {
  static get contextType() {
    return PageContext;
  }

  static get defaultProps() {
    return {
      src: null,
      srcSet: null,
      sizes: null,
      width: null,
      height: null,
      alt: null,
      className: '',
      'data-e2e': null,
      layout: null,
      noloading: false,
      extendedPadding: 0,
      cover: false,
      imageRef: null,
    };
  }

  render() {
    if (this.context.$Utils.$UIComponentHelper.isAmp()) {
      return <AmpImage {...this.props} />;
    } else {
      return <HtmlImage {...this.props} />;
    }
  }
}
