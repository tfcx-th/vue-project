var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var VueLoaderPlugin = require('vue-loader/lib/plugin');


var config = {
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=1024',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              use: 'css-loader',
              fallback: 'vue-style-loader'
            })
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new VueLoaderPlugin()
  ]
};

module.exports = config;