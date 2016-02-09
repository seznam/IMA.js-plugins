'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _service = require('./service.js');

var _service2 = _interopRequireDefault(_service);

var _events = require('./events.js');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*export var __$IMAModuleRegister__ = (ns) => {
	ns.namespace('Module.ScriptLoader');

	ns.Module.ScriptLoader.EVENTS = EVENTS;
	ns.Module.ScriptLoader.Service = Service;

	$IMA.Loader.register('module/scriptloader', [], (_export) => {
		return {
			setters: [],
			execute: () => {
				_export('EVENTS', EVENTS);
				_export('Service', Service);
				_export('default', { Service, EVENTS });
			}
		};
	});
};*/

exports.default = { EVENTS: _events2.default, Service: _service2.default };
/*export { EVENTSService };*/