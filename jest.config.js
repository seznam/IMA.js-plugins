const base = require("./jest.config.base.js");

module.exports = {
    ...base,
    transform: {
        '\\.jsx?': "<rootDir>/preprocess.js"
    },
    projects:
    [
        "<rootDir>/packages/*/jest.config.js"
    ]
};
