import ScriptLoaderPlugin from './ScriptLoaderPlugin.js';
import Events from './Events.js';

var defaultDependencies = ['$Window', '$Dispatcher', Events];

var $registerImaPlugin = (ns) => {
	ns.namespace('ima.plugin.script.loader');

	ns.ima.plugin.script.loader.Events = Events;
	ns.ima.plugin.script.loader.ScriptLoaderPlugin = ScriptLoaderPlugin;
	ns.ima.plugin.script.loader.defaultDependencies = defaultDependencies;
};

export { ScriptLoaderPlugin, Events, defaultDependencies, $registerImaPlugin };
