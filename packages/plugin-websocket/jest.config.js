const base = require("../../jest.config.base.js");

module.exports = {
    ...base,
    globals: {
        functions: 30,
        lines: 40,
        statements: 40
    },
    setupFiles: [],
    transform: {
		"\\.jsx?": "<rootDir>/../../preprocess.js"
    }
};
