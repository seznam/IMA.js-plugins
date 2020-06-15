---
to: packages/<%= h.changeCase.paramCase(name) %>/jest.config.js
---
const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
};
