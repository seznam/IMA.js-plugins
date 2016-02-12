import { __$IMAModuleRegister__ as ModuleAnalyticRegister } from 'ima.js-module-analytic';
import { __$IMAModuleRegister__ as ModuleScriptLoaderRegister } from 'ima.js-module-scriptloader';
import Google from './google.js';

export var __$IMAModuleRegister__ = (ns) => {
	ModuleAnalyticRegister(ns);
	ModuleScriptLoaderRegister(ns);

	ns.namespace('Module.Analytic');

	ns.Module.Analytic.Google = Google;

	$IMA.Loader.register('module/analytic/google', ['module/analytic', 'module/scriptloader'], (_export) => {
		return {
			setters: [],
			execute: () => {
				_export('Google', Google);
				_export('default', { Google });
			}
		};
	});
};

export default { Google };
export { Google };
