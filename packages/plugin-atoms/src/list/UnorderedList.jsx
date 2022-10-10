import React from 'react';
import List from './List';

/**
 * Common unordered HTML List
 *
 * @namespace ima.ui.atom.list
 * @module ima.ui.atom
 */

export default class UnorderedList extends React.PureComponent {
  render() {
    return <List {...this.props} type="ul" />;
  }
}
