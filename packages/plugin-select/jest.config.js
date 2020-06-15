const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jestSetupFile.js'],
  snapshotSerializers: [
    '<rootDir>/../../node_modules/enzyme-to-json/serializer',
  ],
};
