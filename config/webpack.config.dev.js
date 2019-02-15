const merge = require('webpack-merge')
const webpack = require('webpack')

const project = require('./project.config')
const baseWebpackConfig = require('./webpack.base.conf')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  cache: true,
  output: {
    path: project.outDir,
    filename: '[name].js',
    publicPath: '/'
  },

  devtool: 'inline-source-map', // 报错的时候在控制台输出哪一行报错
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()],
  devServer: {
    contentBase: project.outDir,
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
})

module.exports = webpackConfig
