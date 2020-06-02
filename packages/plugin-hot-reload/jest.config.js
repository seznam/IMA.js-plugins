const base = require("../../jest.config.base.js");

module.exports = {
    ...base,
    globals: {
        functions: 15,
        lines: 20,
        statements: 30
    },
    transform: {
		"\\.jsx?": "<rootDir>/../../preprocess.js"
	},
};
