// @ts-expect-error
import { Infinite, Circle, uuid } from 'infinite-circle';

import ComponentPositions from './ComponentPositions';
import Headline from './headline/Headline';
import Headline1 from './headline/Headline1';
import Headline2 from './headline/Headline2';
import Headline3 from './headline/Headline3';
import Headline4 from './headline/Headline4';
import Headline5 from './headline/Headline5';
import Headline6 from './headline/Headline6';
import Iframe from './iframe/Iframe';
import Image from './image/Image';
import Link from './link/Link';
import List from './list/List';
import ListItem from './list/ListItem';
import OrderedList from './list/OrderedList';
import UnorderedList from './list/UnorderedList';
import Loader from './loader/Loader';
import Paragraph from './paragraph/Paragraph';
import Sizer from './sizer/Sizer';
import UIComponentHelper from './UIComponentHelper';
import Video from './video/Video';
import Visibility from './Visibility';

const defaultDependencies = ['$Router', ComponentPositions, Visibility];

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
  Video,
  Circle,
  Infinite,
  uuid,
};
