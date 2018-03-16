import StyleLoaderPlugin from './StyleLoaderPlugin';
import Events from './Events';

let defaultDependencies = StyleLoaderPlugin.$dependencies;

let $registerImaPlugin = () => {};

export { StyleLoaderPlugin, Events, defaultDependencies, $registerImaPlugin };
