/**
 * @type {import('jest').Config}
 */
module.exports = {
  bail: true,
  verbose: true,
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
  modulePaths: ['<rootDir>/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@ima/core|@ima/react-page-renderer)/)'
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            jsx: true
          },
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        }
      }
    ]
  }
};
