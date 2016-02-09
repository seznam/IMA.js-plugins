'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.__$IMAModuleRegister__ = undefined;

var _service = require('./service.js');

var _service2 = babelHelpers.interopRequireDefault(_service);

var _events = require('./events.js');

var _events2 = babelHelpers.interopRequireDefault(_events);

var __$IMAModuleRegister__ = exports.__$IMAModuleRegister__ = function __$IMAModuleRegister__(ns) {
	ns.namespace('Module.ScriptLoader');

	ns.Module.ScriptLoader.EVENTS = _events2.default;
	ns.Module.ScriptLoader.Service = _service2.default;

	$IMA.Loader.register('module/scriptloader', [], function (_export) {
		return {
			setters: [],
			execute: function execute() {
				_export('EVENTS', _events2.default);
				_export('Service', _service2.default);
			}
		};
	});
};

exports.default = { EVENTS: _events2.default, Service: _service2.default };