const asUnit = require('./util').asUnit;

exports.string = function string(stringConstant) {
  return asUnit('', [stringConstant], '~"${parts}"');
};

exports.number = function number(numericConstant) {
  return asUnit('', [numericConstant]);
};
