let asUnit = require('./util').asUnit;

exports.maxWidthMedia = function maxWidthMedia(maxWidth) {
  return asUnit('', [maxWidth.toString()], '~"all and (max-width: ${parts})"');
};

exports.minWidthMedia = function minWidthMedia(minWidth) {
  return asUnit('', [minWidth.toString()], '~"all and (min-width: ${parts})"');
};

exports.minAndMaxWidthMedia = function minAndMaxWidthMedia(minWidth, maxWidth) {
  return asUnit(
    maxWidth.toString(),
    [minWidth.toString()],
    '~"all and (min-width: ${parts}) and (max-width: ${unit})"'
  );
};

exports.maxHeightMedia = function maxHeightMedia(maxHeight) {
  return asUnit('', [maxHeight.toString()], '~"all and (max-height: ${parts})"');
};

exports.minHeightMedia = function minHeightMedia(minHeight) {
  return asUnit('', [minHeight.toString()], '~"all and (min-height: ${parts})"');
};
