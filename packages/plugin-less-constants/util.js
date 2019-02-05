exports.asUnit = function asUnit(unit, parts, template = '${parts}${unit}') {
  return {
    __propertyDeclaration: true,

    valueOf() {
      return parts.length === 1 ? parts[0] : this.toString();
    },

    toString() {
      return template.replace('${parts}', parts.join(',')).replace('${unit}', unit);
    }
  };
};
