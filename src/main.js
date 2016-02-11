import Abstract from './abstract.js';
import EVENTS from './events.js';

export var __$IMAModuleRegister__ = (ns) => {
	ns.namespace('Module.Analytic');

	ns.Module.Analytic.Abstract = Abstract;
	ns.Module.Analytic.EVENTS = EVENTS;

	$IMA.Loader.register('module/analytic', [], (_export) => {
		return {
			setters: [],
			execute: () => {
				_export('Abstract', Abstract);
				_export('EVENTS', EVENTS);
				_export('defualt', { Abstract, EVENTS });
			}
		};
	});
};

export default { Abstract, EVENTS };
export { Abstract, EVENTS };
