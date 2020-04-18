const path = require('path');

module.exports = {
  entry: './static/src/out/engine/gameRunner.js',
  output: {
    path: path.resolve(__dirname, 'static/src/out'),
    filename: 'bundle.js'
  },
  mode: 'development',
  watch: true
};
