'use strict';

var _main = require('../main');

var Main = _interopRequireWildcard(_main);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('Main', () => {
	it('should export $registerImaPlugin', () => {
		expect(typeof Main.$registerImaPlugin).toEqual('function');
	});

	it('should export GoogleAnalytic', () => {
		expect(typeof Main.GoogleAnalytic).toEqual('function');
	});

	it('should export defaultDependencies', () => {
		expect(Array.isArray(Main.defaultDependencies)).toEqual(true);
	});
});