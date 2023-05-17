/**
 * @type import('jest').Config
 */
module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
  modulePaths: ['<rootDir>/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@ima/core|@ima/react-page-renderer)/)',
  ],
  transform: {
    '^.+\\.(js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
    '^.+\\.(ts|tsx)$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
};
