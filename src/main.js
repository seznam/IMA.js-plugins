import { Events, $registerImaPlugin as $registerImaPluginAnalytic } from 'ima-plugin-analytic';
import { ScriptLoaderPlugin, $registerImaPlugin as $registerImaPluginScriptLoader } from 'ima-plugin-script-loader';
import GoogleAnalytic from './GoogleAnalytic.js';

var defaultDependencies = [ScriptLoaderPlugin, '$Window', '$Dispatcher', Events, '$Settings.Module.Analytic.Google'];

var $registerImaPlugin = (ns) => {
	$registerImaPluginAnalytic(ns);
	$registerImaPluginScriptLoader(ns);

	ns.namespace('ima.plugin.analytic.google');

	ns.ima.plugin.analytic.google.GoogleAnalytic = GoogleAnalytic;
	ns.ima.plugin.analytic.google.defaultDependencies = defaultDependencies;
};

export { GoogleAnalytic, defaultDependencies, $registerImaPlugin };
