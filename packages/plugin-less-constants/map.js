exports.lessMap = function lessMap(object) {
  return {
    __lessMap: true,

    valueOf(key = undefined) {
      if (!key) {
        return object;
      }

      return object[key];
    },

    toString() {
      return Object.keys(object)
        .map((key) => `\t${key}: ${object[key]};\n`)
        .join('');
    },
  };
};
