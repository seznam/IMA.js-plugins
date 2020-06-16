module.exports = {
  bail: true,
  verbose: true,
  testRegex: '(/src(/?[^/]*){0,5}/__tests__/).*Spec\\.jsx?$',
  modulePaths: ['<rootDir>/'],
  transform: {
    '\\.jsx?': '<rootDir>/../../preprocess.js'
  },
  testEnvironment: 'node'
};
