const defaultToArray = {
  dataFieldName: null,
  deserialize(value) {
    return value || [];
  },
  serialize(value) {
    return value;
  },
};

export default defaultToArray;
