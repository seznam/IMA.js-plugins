module.exports = {
  bail: true,
  verbose: true,
  testRegex: '(/src(/?[^/]*){0,5}/__tests__/).*Spec\\.jsx?$',
  modulePaths: ['<rootDir>/'],
  transformIgnorePatterns: ['node_modules/(?!(@ima/core)/)'],
  transform: {
    '\\.(js|jsx|ts|tsx)': '<rootDir>/../../preprocess.js'
  },
  testEnvironment: 'node'
};
