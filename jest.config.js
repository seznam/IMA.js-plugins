module.exports = {
  verbose: true,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  coverageThreshold: {
    global: {
      functions: 65,
      lines: 75,
      statements: 75
    }
  }
};
