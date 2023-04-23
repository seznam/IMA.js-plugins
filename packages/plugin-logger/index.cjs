if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/production/cjs/main.js');
} else {
  module.exports = require('./dist/development/cjs/main.js');
}
