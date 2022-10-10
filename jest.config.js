module.exports = {
  verbose: true,
  projects: ['<rootDir>/packages/*/jest.config.cjs'],
  coverageThreshold: {
    global: {
      functions: 60,
      lines: 70,
      statements: 70
    }
  }
};
