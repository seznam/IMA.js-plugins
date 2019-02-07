let asUnit = require('./util').asUnit;

// lengths

exports.px = function px(size) {
  return asUnit('px', [size]);
};

exports.em = function em(size) {
  return asUnit('em', [size]);
};

exports.rem = function rem(size) {
  return asUnit('rem', [size]);
};

exports.percent = function percent(size) {
  return asUnit('%', [size]);
};

// colors

exports.hex = function hex(rgb) {
  return asUnit('#', [rgb], '${unit}${parts}');
};

exports.rgba = function rgba(red, green, blue, opacity) {
  return asUnit('rgba', [red, green, blue, opacity], '${unit}(${parts})');
};
