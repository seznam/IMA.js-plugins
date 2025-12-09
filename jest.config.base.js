/**
 * @type import('jest').Config
 */
module.exports = {
  rootDir: '.',
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
  modulePaths: ['<rootDir>/'],
  transform: {
    '^.+\\.(js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          experimental: {
            plugins: [['@swc-contrib/mut-cjs-exports', {}]],
          },
          target: 'es2024',
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
          experimental: {
            plugins: [['@swc-contrib/mut-cjs-exports', {}]],
          },
          target: 'es2024',
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
