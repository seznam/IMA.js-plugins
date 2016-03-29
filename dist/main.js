'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.$registerImaPlugin = exports.Events = exports.AbstractAnalytic = undefined;

var _AbstractAnalytic = require('./AbstractAnalytic.js');

var _AbstractAnalytic2 = _interopRequireDefault(_AbstractAnalytic);

var _Events = require('./Events.js');

var _Events2 = _interopRequireDefault(_Events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $registerImaPlugin = ns => {
	ns.namespace('ima.plugin.analytic');

	ns.ima.plugin.analytic.AbstractAnalytic = _AbstractAnalytic2.default;
	ns.ima.plugin.analytic.Events = _Events2.default;
};

exports.AbstractAnalytic = _AbstractAnalytic2.default;
exports.Events = _Events2.default;
exports.$registerImaPlugin = $registerImaPlugin;