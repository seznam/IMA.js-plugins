import Service from './service.js';
import EVENTS from './events.js';

var ServiceDependencies = ['$Window', '$Dispatcher', EVENTS];

export var __$IMAModuleRegister__ = (ns) => {
	ns.namespace('Module.ScriptLoader');

	ns.Module.ScriptLoader.EVENTS = EVENTS;
	ns.Module.ScriptLoader.Service = Service;
	ns.Module.ScriptLoader.ServiceDependencies = ServiceDependencies;

	$IMA.Loader.register('module/scriptloader', [], (_export) => {
		return {
			setters: [],
			execute: () => {
				_export('EVENTS', EVENTS);
				_export('Service', Service);
				_export('ServiceDependencies', ServiceDependencies);
				_export('default', { Service, EVENTS, ServiceDependencies });
			}
		};
	});
};

export default { EVENTS, Service, ServiceDependencies };
export { EVENTS, Service, ServiceDependencies };
