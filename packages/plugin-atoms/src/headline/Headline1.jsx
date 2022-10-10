import React from 'react';
import Headline from './Headline';

/**
 * Common Headline 1 title
 *
 * @namespace ima.ui.atom.headline
 * @module ima.ui.atom
 */
export default class Headline1 extends React.PureComponent {
  render() {
    return <Headline {...this.props} type="h1" />;
  }
}
