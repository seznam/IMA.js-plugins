module.exports = {
  bail: true,
  verbose: true,
  testRegex: '(/src(/?[^/]*){0,5}/__tests__/).*Spec\\.jsx?$',
  modulePaths: ['<rootDir>/'],
  transform: {
    '\\.(js|jsx|ts|tsx)': '<rootDir>/../../preprocess.js'
  },
  testEnvironment: 'node'
};
