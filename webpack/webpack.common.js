const path = require('path');

module.exports = {
  entry: ['./src/server.js'],
  target: "node",
  resolve: {
    extensions: ['.js', '.json'],
    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'server.js',
    chunkFilename: '[chunkhash].js',
    publicPath: '/'
  }
}