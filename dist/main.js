'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _abstractJs = require('./abstract.js');

var _abstractJs2 = _interopRequireDefault(_abstractJs);

var _dotJs = require('./dot.js');

var _dotJs2 = _interopRequireDefault(_dotJs);

var _googleJs = require('./google.js');

var _googleJs2 = _interopRequireDefault(_googleJs);

var _gemiusJs = require('./gemius.js');

var _gemiusJs2 = _interopRequireDefault(_gemiusJs);

var _eventsJs = require('./events.js');

var _eventsJs2 = _interopRequireDefault(_eventsJs);

var __$IMAModuleRegister__ = function __$IMAModuleRegister__(ns) {
	ns.namespace('Module.Analytic');

	ns.Module.Analytic.Abstract = _abstractJs2['default'];
	ns.Module.Analytic.Dot = _dotJs2['default'];
	ns.Module.Analytic.EVENTS = _eventsJs2['default'];
	ns.Module.Analytic.Google = _googleJs2['default'];
	ns.Module.Analytic.Gemius = _gemiusJs2['default'];

	$IMA.Loader.register('module/analytic', [], function (_export) {
		return {
			setters: [],
			execute: function execute() {
				_export('Abstract', _abstractJs2['default']);
				_export('Dot', _dotJs2['default']);
				_export('EVENTS', _eventsJs2['default']);
				_export('Google', _googleJs2['default']);
				_export('Gemius', _gemiusJs2['default']);
			}
		};
	});
};

exports.__$IMAModuleRegister__ = __$IMAModuleRegister__;
exports['default'] = { Abstract: _abstractJs2['default'], Dot: _dotJs2['default'], Google: _googleJs2['default'], Gemius: _gemiusJs2['default'], EVENTS: _eventsJs2['default'] };