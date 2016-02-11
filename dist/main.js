'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EVENTS = exports.Abstract = exports.__$IMAModuleRegister__ = undefined;

var _abstract = require('./abstract.js');

var _abstract2 = _interopRequireDefault(_abstract);

var _events = require('./events.js');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __$IMAModuleRegister__ = exports.__$IMAModuleRegister__ = ns => {
	ns.namespace('Module.Analytic');

	ns.Module.Analytic.Abstract = _abstract2.default;
	ns.Module.Analytic.EVENTS = _events2.default;

	$IMA.Loader.register('module/analytic', [], _export => {
		return {
			setters: [],
			execute: () => {
				_export('Abstract', _abstract2.default);
				_export('EVENTS', _events2.default);
				_export('defualt', { Abstract: _abstract2.default, EVENTS: _events2.default });
			}
		};
	});
};

exports.default = { Abstract: _abstract2.default, EVENTS: _events2.default };
exports.Abstract = _abstract2.default;
exports.EVENTS = _events2.default;