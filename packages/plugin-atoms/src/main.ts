import { ComponentUtils, pluginLoader } from '@ima/core';
// @ts-expect-error
import { Infinite, Circle, uuid } from 'infinite-circle';

import ComponentPositions from './ComponentPositions';
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
//import { IframeDeprectecated } from './components/IframeDeprectecated';
import { Image } from './components/Image';
import { LAYOUT } from './components/layout';
import { Link } from './components/Link';
import { List, OrderedList, UnorderedList } from './components/List';
import { ListItem } from './components/ListItem';
import { Loader } from './components/Loader';
import { Paragraph } from './components/Paragraph';
import { Sizer } from './components/Sizer';
import UIComponentHelper from './UIComponentHelper';
import Visibility from './Visibility';

export interface PluginAtomsSettings {
  uiAtoms?: {
    useIntersectionObserver?: {
      iframes?: boolean;
      images?: boolean;
      videos?: boolean;
    };
    disableNoScript?: {
      iframes?: boolean;
      images?: boolean;
      videos?: boolean;
    };
  };
}

declare module '@ima/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PluginSettings extends PluginAtomsSettings {}

  interface Settings {
    plugin: PluginSettings;
  }

  interface Utils {
    $UIComponentHelper: UIComponentHelper;
  }
}

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
    initSettings: () => {
      return {
        prod: {
          plugin: {
            uiAtoms: {
              useIntersectionObserver: {
                iframes: true,
                images: true,
                videos: true,
              },
              disableNoScript: {
                iframes: false,
                images: false,
                videos: false,
              },
            },
          },
        },
      };
    },
  };
});

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
  //IframeDeprectecated,
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
  Circle,
  Infinite,
  uuid,
};
