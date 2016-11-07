import ScriptLoaderPlugin from './ScriptLoaderPlugin';
import Events from './Events';

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
