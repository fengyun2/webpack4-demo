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

  devtool: 'cheap-module-eval-source-map', // 报错的时候在控制台输出哪一行报错
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, // 防止重复保存频繁重新编译,300ms内重复保存不打包
    poll: 1000 // 每秒询问的文件变更的次数
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
    hot: true,
    inline: true
  },
  stats: {
    children: false
  }
})

module.exports = webpackConfig
