import { PureComponent } from 'react';
import Headline from './Headline';

/**
 * Common Headline 6 title
 *
 * @namespace ima.ui.atom.headline
 * @module ima.ui.atom
 */
export default class Headline6 extends PureComponent {
  render() {
    return <Headline {...this.props} type="h6" />;
  }
}
