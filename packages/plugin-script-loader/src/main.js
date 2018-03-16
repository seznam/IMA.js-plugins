import ScriptLoaderPlugin from './ScriptLoaderPlugin';
import Events from './Events';

let defaultDependencies = ScriptLoaderPlugin.$dependencies;

let $registerImaPlugin = () => {};

export { ScriptLoaderPlugin, Events, defaultDependencies, $registerImaPlugin };
