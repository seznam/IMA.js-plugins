'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _baseAnalyticJs = require('../base/analytic.js');

var _baseAnalyticJs2 = _interopRequireDefault(_baseAnalyticJs);

var DotModule = (function (_ns$Core$Analytic$Interface) {
	_inherits(DotModule, _ns$Core$Analytic$Interface);

	function DotModule() {
		_classCallCheck(this, DotModule);

		_ns$Core$Analytic$Interface.call(this);
	}

	DotModule.prototype.hit = function hit() {
		console.log('DOT hit');
	};

	return DotModule;
})(ns.Core.Analytic.Interface);

exports['default'] = DotModule;
module.exports = exports['default'];