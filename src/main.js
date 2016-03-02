import { Events } from 'ima-plugin-analytic';
import { ScriptLoaderPlugin } from 'ima-plugin-script-loader';
import GoogleAnalytic from './GoogleAnalytic.js';

var defaultDependencies = [ScriptLoaderPlugin, '$Window', '$Dispatcher', Events, '$Settings.Module.Analytic.Google'];

var $registerImaPlugin = (ns) => {
	ns.namespace('ima.plugin.analytic');

	ns.ima.plugin.analytic.GoogleAnalytic = GoogleAnalytic;
};

export { GoogleAnalytic, defaultDependencies, $registerImaPlugin };
