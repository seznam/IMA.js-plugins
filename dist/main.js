'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Google = exports.__$IMAModuleRegister__ = undefined;

var _ima = require('ima.js-module-analytic');

var _ima2 = require('ima.js-module-scriptloader');

var _google = require('./google.js');

var _google2 = _interopRequireDefault(_google);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __$IMAModuleRegister__ = exports.__$IMAModuleRegister__ = ns => {
	(0, _ima.__$IMAModuleRegister__)(ns);
	(0, _ima2.__$IMAModuleRegister__)(ns);

	ns.namespace('Module.Analytic');

	ns.Module.Analytic.Google = _google2.default;

	$IMA.Loader.register('module/analytic/google', ['module/analytic', 'module/scriptloader'], _export => {
		return {
			setters: [],
			execute: () => {
				_export('Google', _google2.default);
				_export('default', { Google: _google2.default });
			}
		};
	});
};

exports.default = { Google: _google2.default };
exports.Google = _google2.default;