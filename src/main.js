import ScriptLoaderPlugin from './ScriptLoaderPlugin.js';
import Events from './events.js';

let defaultDependencies = ['$Window', '$Dispatcher'];

let $registerImaPlugin = (ns) => {
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
