import { PageContext } from '@ima/core';
import React from 'react';
import HtmlImage from './HtmlImage';
import AmpImage from './AmpImage';

/**
 * Common image
 *
 * @namespace ima.ui.atom.image
 * @module ima.ui.atom
 */

export default class Image extends React.PureComponent {
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
      cover: false
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
