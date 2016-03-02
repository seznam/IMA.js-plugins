'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.$registerImaPlugin = exports.defaultDependencies = exports.Events = exports.ScriptLoaderPlugin = undefined;

var _ScriptLoaderPlugin = require('./ScriptLoaderPlugin.js');

var _ScriptLoaderPlugin2 = _interopRequireDefault(_ScriptLoaderPlugin);

var _Events = require('./Events.js');

var _Events2 = _interopRequireDefault(_Events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultDependencies = ['$Window', '$Dispatcher', _Events2.default];

var $registerImaPlugin = ns => {
	ns.namespace('ima.plugin.script.loader');

	ns.ima.plugin.script.loader.Events = _Events2.default;
	ns.ima.plugin.script.loader.ScriptLoaderPlugin = _ScriptLoaderPlugin2.default;
	ns.Module.Script.loader.defaultDependencies = defaultDependencies;
};

exports.ScriptLoaderPlugin = _ScriptLoaderPlugin2.default;
exports.Events = _Events2.default;
exports.defaultDependencies = defaultDependencies;
exports.$registerImaPlugin = $registerImaPlugin;