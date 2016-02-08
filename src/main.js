import Handler from './handler.js';
import EVENTS from './events.js';

export var __$IMAModuleRegister__ = (ns) => {
	ns.namespace('Module.ScriptLoader');

	ns.Module.ScriptLoader.EVENTS = EVENTS;
	ns.Module.ScriptLoader.Handler = Handler;

	$IMA.Loader.register('module/scriptloader', [], (_export) => {
		return {
			setters: [],
			execute: () => {
				_export('EVENTS', EVENTS);
				_export('Handler', Handler);
			}
		};
	});
};

export default { EVENTS, Handler };
