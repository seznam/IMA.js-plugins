const base = require("../../jest.config.base.js");

module.exports = {
    ...base,
    globals: {
        functions: 62,
        lines: 70,
        statements: 57
    },
    testEnvironment: "jsdom",
    setupFiles: ["<rootDir>/jestSetupFile.js"],
    transform: {
		"\\.jsx?": "<rootDir>/../../preprocess.js"
    },
    snapshotSerializers: ["<rootDir>/node_modules/enzyme-to-json/serializer"]
};
