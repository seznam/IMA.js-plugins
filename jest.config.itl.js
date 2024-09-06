const base = require('./jest.config.base.js');

module.exports = {
  ...base,
  preset: '@ima/testing-library',
  moduleNameMapper: {
    '^app/main$': '<rootDir>/../../utils/integration/main.js',
  }
};
