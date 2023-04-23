import { ComponentUtils, pluginLoader } from '@ima/core';
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
  ns.namespace('ima.ui.atom');
  ns.namespace('ima.ui.atom.headline');
  ns.namespace('ima.ui.atom.iframe');
  ns.namespace('ima.ui.atom.image');
  ns.namespace('ima.ui.atom.link');
  ns.namespace('ima.ui.atom.list');
  ns.namespace('ima.ui.atom.loader');
  ns.namespace('ima.ui.atom.paragraph');
  ns.namespace('ima.ui.atom.sizer');
  ns.namespace('ima.ui.atom.video');

  ns.set('ima.ui.atom.headline.Headline', Headline);
  ns.set('ima.ui.atom.headline.Headline1', Headline1);
  ns.set('ima.ui.atom.headline.Headline2', Headline2);
  ns.set('ima.ui.atom.headline.Headline3', Headline3);
  ns.set('ima.ui.atom.headline.Headline4', Headline4);
  ns.set('ima.ui.atom.headline.Headline5', Headline5);
  ns.set('ima.ui.atom.headline.Headline6', Headline6);
  ns.set('ima.ui.atom.headline.H1', Headline1);
  ns.set('ima.ui.atom.headline.H2', Headline2);
  ns.set('ima.ui.atom.headline.H3', Headline3);
  ns.set('ima.ui.atom.headline.H4', Headline4);
  ns.set('ima.ui.atom.headline.H5', Headline5);
  ns.set('ima.ui.atom.headline.H6', Headline6);
  ns.set('ima.ui.atom.iframe.Iframe', Iframe);
  ns.set('ima.ui.atom.image.Image', Image);
  ns.set('ima.ui.atom.image.Img', Image);
  ns.set('ima.ui.atom.link.Link', Link);
  ns.set('ima.ui.atom.link.A', Link);
  ns.set('ima.ui.atom.list.List', List);
  ns.set('ima.ui.atom.list.ListItem', ListItem);
  ns.set('ima.ui.atom.list.OrderedList', OrderedList);
  ns.set('ima.ui.atom.list.UnorderedList', UnorderedList);
  ns.set('ima.ui.atom.list.Li', ListItem);
  ns.set('ima.ui.atom.list.Ol', OrderedList);
  ns.set('ima.ui.atom.list.Ul', UnorderedList);
  ns.set('ima.ui.atom.loader.Loader', Loader);
  ns.set('ima.ui.atom.paragraph.Paragraph', Paragraph);
  ns.set('ima.ui.atom.paragraph.P', Paragraph);
  ns.set('ima.ui.atom.sizer.Sizer', Sizer);
  ns.set('ima.ui.atom.video.Video', Video);
  ns.set('ima.ui.atom.UIComponentHelper', UIComponentHelper);
  ns.set('ima.ui.atom.Visibility', Visibility);
  ns.set('ima.ui.atom.ComponentPositions', ComponentPositions);
  ns.set('ima.ui.atom.defaultDependencies', defaultDependencies);

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
