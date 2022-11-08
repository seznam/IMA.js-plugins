import { PureComponent } from 'react';
import Headline from './Headline';

/**
 * Common Headline 3 title
 *
 * @namespace ima.ui.atom.headline
 * @module ima.ui.atom
 */
export default class Headline3 extends PureComponent {
  render() {
    return <Headline {...this.props} type="h3" />;
  }
}
