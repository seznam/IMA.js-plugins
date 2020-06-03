const base = require("../../jest.config.base.js");

module.exports = {
    ...base,
    globals: {
        functions: 5,
        lines: 5,
        statements: 5
    }
};
