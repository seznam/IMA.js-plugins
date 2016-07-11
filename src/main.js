import ScriptLoaderPlugin from './ScriptLoaderPlugin.js';
import Events from './Events.js';

let defaultDependencies = ['$Window', '$Dispatcher', Events];

let $registerImaPlugin = (ns) => {
	ns.namespace('ima.plugin.script.loader');

	ns.ima.plugin.script.loader.Events = Events;
	ns.ima.plugin.script.loader.ScriptLoaderPlugin = ScriptLoaderPlugin;
	ns.ima.plugin.script.loader.defaultDependencies = defaultDependencies;
};

let initBind = (ns, oc, config) => {
	oc.inject(ScriptLoaderPlugin, defaultDependencies);
};

export {
	ScriptLoaderPlugin,
	Events,
	defaultDependencies,
	$registerImaPlugin,
	initBind
};
