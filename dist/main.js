'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.__$IMAModuleRegister__ = undefined;

var _handler = require('./handler.js');

var _handler2 = babelHelpers.interopRequireDefault(_handler);

var _events = require('./events.js');

var _events2 = babelHelpers.interopRequireDefault(_events);

var __$IMAModuleRegister__ = exports.__$IMAModuleRegister__ = function __$IMAModuleRegister__(ns) {
	ns.namespace('Module.ScriptLoader');

	ns.Module.ScriptLoader.EVENTS = _events2.default;
	ns.Module.ScriptLoader.Handler = _handler2.default;

	$IMA.Loader.register('module/scriptloader', [], function (_export) {
		return {
			setters: [],
			execute: function execute() {
				_export('EVENTS', _events2.default);
				_export('Handler', _handler2.default);
			}
		};
	});
};

exports.default = { EVENTS: _events2.default, Handler: _handler2.default };