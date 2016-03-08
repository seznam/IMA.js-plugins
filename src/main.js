import { Events } from 'ima-plugin-analytic';
import { ScriptLoaderPlugin } from 'ima-plugin-script-loader';
import GoogleAnalytic from './GoogleAnalytic.js';

var defaultDependencies = [ScriptLoaderPlugin, '$Window', '$Dispatcher', Events, '$Settings.plugin.analytic.google'];

var $registerImaPlugin = (ns) => {
	ns.namespace('ima.plugin.analytic.google');

	ns.ima.plugin.analytic.google.GoogleAnalytic = GoogleAnalytic;
	ns.ima.plugin.analytic.google.defaultDependencies = defaultDependencies;
};

export { GoogleAnalytic, defaultDependencies, $registerImaPlugin };
