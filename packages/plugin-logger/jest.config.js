const base = require("../../jest.config.base.js");

module.exports = {
    ...base,
    globals: {
        functions: 10,
        lines: 10,
        statements: 10
    },
    testEnvironment: "node",
    transform: {
		"\\.jsx?": "<rootDir>/../../preprocess.js"
	},
};
