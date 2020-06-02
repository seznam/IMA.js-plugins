const base = require("../../jest.config.base.js");

module.exports = {
    ...base,
    globals: {
        functions: 20,
        lines: 20,
        statements: 20
    },
    testEnvironment: "node",
    setupFiles: [],
    transform: {
		"\\.jsx?": "<rootDir>/../../preprocess.js"
    }
};
