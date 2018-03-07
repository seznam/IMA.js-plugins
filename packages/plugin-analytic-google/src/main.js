import { ScriptLoaderPlugin } from 'ima-plugin-script-loader';
import GoogleAnalytic from './GoogleAnalytic.js';

let defaultDependencies = [
	ScriptLoaderPlugin,
	'$Window',
	'$Dispatcher',
	'$Settings.plugin.analytic.google'
];

let $registerImaPlugin = (ns) => {};

let initBind = (ns, oc, config) => {
	oc.inject(GoogleAnalytic, defaultDependencies);
};

let initSettings = (ns, oc, config) => {
	return {
		prod: {
			plugin : {
				analytic: {
					google: {
						service: 'UA-XXXXXXX-X',
						settings: {}
					}
				}
			}
		},

		test: {
		},

		dev: {
		}
	};
};

export {
	GoogleAnalytic,
	defaultDependencies,
	$registerImaPlugin,
	initBind,
	initSettings
};
