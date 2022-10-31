import { PageContext } from '@ima/react-page-renderer';
import React from 'react';
import AmpVideo from './AmpVideo';
import HtmlVideo from './HtmlVideo';

/**
 * Video player.
 *
 * @namespace ima.ui.atom.video
 * @module ima.ui.atom
 */

export default class Video extends React.PureComponent {
  static get contextType() {
    return PageContext;
  }

  static get defaultProps() {
    return {
      src: null,
      poster: null,
      autoplay: false,
      controls: false,
      loop: false,
      muted: false,
      width: null,
      height: null,
      layout: null,
      className: '',
      noloading: false
    };
  }

  render() {
    if (this.context.$Utils.$UIComponentHelper.isAmp()) {
      return <AmpVideo {...this.props} />;
    } else {
      return <HtmlVideo {...this.props} />;
    }
  }
}
