const base = require("../../jest.config.base.js");

module.exports = {
    ...base,
    globals: {
        functions: 70,
        lines: 70,
        statements: 70
    }
};
