'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.__$IMAModuleRegister__ = undefined;

var _abstract = require('./abstract.js');

var _abstract2 = babelHelpers.interopRequireDefault(_abstract);

var _dot = require('./dot.js');

var _dot2 = babelHelpers.interopRequireDefault(_dot);

var _google = require('./google.js');

var _google2 = babelHelpers.interopRequireDefault(_google);

var _gemius = require('./gemius.js');

var _gemius2 = babelHelpers.interopRequireDefault(_gemius);

var _events = require('./events.js');

var _events2 = babelHelpers.interopRequireDefault(_events);

var __$IMAModuleRegister__ = exports.__$IMAModuleRegister__ = function __$IMAModuleRegister__(ns) {
	ns.namespace('Module.Analytic');

	ns.Module.Analytic.Abstract = _abstract2.default;
	ns.Module.Analytic.Dot = _dot2.default;
	ns.Module.Analytic.EVENTS = _events2.default;
	ns.Module.Analytic.Google = _google2.default;
	ns.Module.Analytic.Gemius = _gemius2.default;

	$IMA.Loader.register('module/analytic', [], function (_export) {
		return {
			setters: [],
			execute: function execute() {
				_export('Abstract', _abstract2.default);
				_export('Dot', _dot2.default);
				_export('EVENTS', _events2.default);
				_export('Google', _google2.default);
				_export('Gemius', _gemius2.default);
			}
		};
	});
};

exports.default = { Abstract: _abstract2.default, Dot: _dot2.default, Google: _google2.default, Gemius: _gemius2.default, EVENTS: _events2.default };