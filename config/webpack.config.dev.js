const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

const baseWebpackConfig = require('./webpack.base.conf');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
};

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: PATHS.dist,
    filename: '[name].js',
    publicPath: '/'
  },

  devtool: "inline-source-map", // 报错的时候在控制台输出哪一行报错
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    contentBase: PATHS.dist,
    compress: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    },
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    port: 8080,
    publicPath: 'http://localhost:8080/',
    hot: true
  },
  stats: {
    children: false
  }
});

module.exports = webpackConfig;
