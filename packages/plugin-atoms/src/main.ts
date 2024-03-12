import './types';
import { ComponentUtils, pluginLoader } from '@ima/core';
import { Infinite } from 'infinite-circle';

import ComponentPositions from './ComponentPositions';
import { LAYOUT, LOADING } from './components/constants';
import {
  Headline,
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
} from './components/Headline';
import { Iframe } from './components/Iframe';
import { Image } from './components/Image';
import { Link } from './components/Link';
import { List, OrderedList, UnorderedList } from './components/List';
import { ListItem } from './components/ListItem';
import { Loader } from './components/Loader';
import { Paragraph } from './components/Paragraph';
import { Sizer } from './components/Sizer';
import UIComponentHelper, { type VisibilityOptions } from './UIComponentHelper';
import Visibility from './Visibility';

const defaultDependencies = ['$Router', ComponentPositions, Visibility];

pluginLoader.register('@ima/plugin-atoms', ns => {
  return {
    initBind: (ns, oc) => {
      oc.inject(Infinite, []);
    },
    initServices: (ns, oc) => {
      oc.get(UIComponentHelper).init();
      oc.get(ComponentUtils).register(
        '$UIComponentHelper',
        UIComponentHelper,
        '@ima/plugin-atoms'
      );
    },
  };
});

export type { VisibilityOptions };
export {
  UIComponentHelper,
  Visibility,
  ComponentPositions,
  defaultDependencies,
  Headline,
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
  Headline1 as H1,
  Headline2 as H2,
  Headline3 as H3,
  Headline4 as H4,
  Headline5 as H5,
  Headline6 as H6,
  Iframe,
  Image,
  Image as Img,
  Link,
  Link as A,
  List,
  ListItem,
  OrderedList,
  UnorderedList,
  ListItem as Li,
  OrderedList as Ol,
  UnorderedList as Ul,
  Loader,
  Paragraph,
  Paragraph as P,
  Sizer,
  LAYOUT,
  LOADING,
};
