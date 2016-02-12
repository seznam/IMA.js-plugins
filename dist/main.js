'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ServiceDependencies = exports.Service = exports.EVENTS = exports.__$IMAModuleRegister__ = undefined;

var _service = require('./service.js');

var _service2 = _interopRequireDefault(_service);

var _events = require('./events.js');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServiceDependencies = ['$Window', '$Dispatcher', _events2.default];

var __$IMAModuleRegister__ = exports.__$IMAModuleRegister__ = ns => {
	ns.namespace('Module.ScriptLoader');

	ns.Module.ScriptLoader.EVENTS = _events2.default;
	ns.Module.ScriptLoader.Service = _service2.default;
	ns.Module.ScriptLoader.ServiceDependencies = ServiceDependencies;

	$IMA.Loader.register('module/scriptloader', [], _export => {
		return {
			setters: [],
			execute: () => {
				_export('EVENTS', _events2.default);
				_export('Service', _service2.default);
				_export('ServiceDependencies', ServiceDependencies);
				_export('default', { Service: _service2.default, EVENTS: _events2.default, ServiceDependencies });
			}
		};
	});
};

exports.default = { EVENTS: _events2.default, Service: _service2.default, ServiceDependencies };
exports.EVENTS = _events2.default;
exports.Service = _service2.default;
exports.ServiceDependencies = ServiceDependencies;