const path = require('path');

module.exports = [
	"source-map"
].map(devtool => ({
	mode: "development",
	entry: './static/src/out/engine/gameRunner.js',
  output: {
    path: path.resolve(__dirname, 'static/src/out'),
    filename: 'bundle.js'
  },
	devtool,
	watch: true
}));