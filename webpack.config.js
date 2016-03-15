path = require('path')

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    path.join(__dirname, 'src', 'index.js')
  ],

  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    preLoaders: [{
      // set up standard-loader as a preloader
      test: /\.js?$/,
      include: path.join(__dirname, 'src', 'scripts'),
      loader: 'standard'
    }],

    loaders: [
      {
        test: /\.js?$/,
        include: path.join(__dirname, 'src', 'scripts'),
        loader: 'babel'
      },

      {
        test: /\.styl$/,
        include: path.join(__dirname, 'src', 'styles'),
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.styl'],
    root: [
      path.join(__dirname, 'src')
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    inline: true,
    progress: true,
    publicPath: '/'
  }
};
