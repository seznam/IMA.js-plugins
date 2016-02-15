import Service from './service.js';
import EVENTS from './events.js';

var DefaultDependencies = ['$Window', '$Dispatcher', EVENTS];

var __$IMAModuleDependencies__ = [];

var __$IMAModuleRegister__ = (ns) => {
	ns.namespace('Module.ScriptLoader');

	ns.Module.ScriptLoader.EVENTS = EVENTS;
	ns.Module.ScriptLoader.Service = Service;
	ns.Module.ScriptLoader.DefaultDependencies = DefaultDependencies;

	$IMA.Loader.register('module/scriptloader', [], (_export) => {
		return {
			setters: [],
			execute: () => {
				_export('EVENTS', EVENTS);
				_export('Service', Service);
				_export('DefaultDependencies', DefaultDependencies);
				_export('__$IMAModuleDependencies__', __$IMAModuleDependencies__);
				_export('__$IMAModuleRegister__', __$IMAModuleRegister__);
			}
		};
	});
};

export { EVENTS, Service, DefaultDependencies, __$IMAModuleDependencies__, __$IMAModuleRegister__ };
