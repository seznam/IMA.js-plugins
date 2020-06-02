const base = require("../../jest.config.base.js");

module.exports = {
    ...base,
    globals: {
        functions: 8,
        lines: 20,
        statements: 20
    },
    testEnvironment: "node",
    setupFiles: ["<rootDir>/jestSetup.js"],
    transform: {
		"\\.jsx?": "<rootDir>/../../preprocess.js"
	},
};
