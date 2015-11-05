import Abstract from './abstract.js';
import Dot from './dot.js';
import Google from './google.js';
import Gemius from './gemius.js';
import EVENTS from './events.js';

export var __$IMAModuleRegister__ = (ns) => {
	ns.namespace('Module.Analytic');

	ns.Module.Analytic.Abstract = Abstract;
	ns.Module.Analytic.Dot = Dot;
	ns.Module.Analytic.EVENTS = EVENTS;
	ns.Module.Analytic.Google = Google;
	ns.Module.Analytic.Gemius = Gemius;

	$IMA.Loader.register('module/analytic', [], (_export) => {
		return {
			setters: [],
			execute: () => {
				_export('Abstract', Abstract);
				_export('Dot', Dot);
				_export('EVENTS', EVENTS);
				_export('Google', Google);
				_export('Gemius', Gemius);
			}
		};
	});
};

export default { Abstract, Dot, Google, Gemius, EVENTS };


