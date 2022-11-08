import { PureComponent } from 'react';
import Headline from './Headline';

/**
 * Common Headline 4 title
 *
 * @namespace ima.ui.atom.headline
 * @module ima.ui.atom
 */
export default class Headline4 extends PureComponent {
  render() {
    return <Headline {...this.props} type="h4" />;
  }
}
