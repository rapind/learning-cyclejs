Webpack = require('webpack')
path = require('path')
ROOT = path.join(__dirname)

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    path.join(ROOT, 'src', 'index.coffee')
  ],

  output: {
    path: path.join(ROOT, 'public'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    preLoaders: [{
      // set up standard-loader as a preloader
      test: /\.coffee?$/,
      include: path.join(ROOT, 'src'),
      loader: 'coffeelint-loader'
    }],

    loaders: [
      {
        test: /\.coffee?$/,
        include: path.join(ROOT, 'src'),
        loader: 'coffee-loader'
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.coffee'],
    root: [
      path.join(ROOT, 'src')
    ]
  },

  devServer: {
    contentBase: path.join(ROOT, 'public'),
    inline: true,
    progress: true,
    publicPath: '/'
  }
};
