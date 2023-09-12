import { ComponentUtils, pluginLoader } from '@ima/core';
// @ts-expect-error
import { Infinite, Circle, uuid } from 'infinite-circle';

import ComponentPositions from './ComponentPositions';
import {
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
} from './headline/Headline';
import { Iframe } from './iframe/Iframe';
import { Image } from './image/Image';
import { Link } from './link/Link';
import { List, OrderedList, UnorderedList } from './list/List';
import { ListItem } from './list/ListItem';
import { Loader } from './loader/Loader';
import { Paragraph } from './paragraph/Paragraph';
import { Sizer } from './sizer/Sizer';
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
  // TODO DOC removed ns.namespace(ima.ui.atom);
  // TODO DOC removed mode, layout, atd props in component (except Loader)
  // TODO DOC removed Headline generic component (only h1, h2, etc are exported)
  // TODO DOC css class atm-h1 => atm-headline-h1, etc
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
  Circle,
  Infinite,
  uuid,
};
