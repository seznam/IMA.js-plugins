import Service from './service.js';
import EVENTS from './events.js';

export var __$IMAModuleRegister__ = (ns) => {
	ns.namespace('Module.ScriptLoader');

	ns.Module.ScriptLoader.EVENTS = EVENTS;
	ns.Module.ScriptLoader.Service = Service;

	$IMA.Loader.register('module/scriptloader', [], (_export) => {
		return {
			setters: [],
			execute: () => {
				_export('EVENTS', EVENTS);
				_export('Service', Service);
			}
		};
	});
};

export default { EVENTS, Service };
