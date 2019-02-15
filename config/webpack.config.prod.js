const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const path = require('path')

const baseWebpackConfig = require('./webpack.base.conf')
const { vendor, outDir } = require('./project.config')

// the path(s) that should be cleaned
const pathsToClean = ['dist/**/*.*']

// the clean options to use
const cleanOptions = {
  root: path.resolve(__dirname, '../')
  // verbose: true, dry: false,
}

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
}

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    vendor
  },
  output: {
    path: outDir,
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  module: {},
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: { safe: true }
    }), // use OptimizeCSSAssetsPlugin
    new WebpackParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false, // 不需要格式化
          comments: false // 不保留注释
        },
        compress: {
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions)
  ],
  optimization: {
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10,
          enforce: true
        }
      }
    },
    runtimeChunk: {
      name: "manifest"
    }
  }
})

module.exports = webpackConfig
