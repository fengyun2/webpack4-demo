const merge = require('webpack-merge');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');

const baseWebpackConfig = require('./webpack.base.conf');

// the path(s) that should be cleaned
const pathsToClean = ['dist/**/*.*'];

// the clean options to use
const cleanOptions = {
  root: path.resolve(__dirname, '../'),
  // verbose: true, dry: false,
};

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
};

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: PATHS.dist,
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({}) // use OptimizeCSSAssetsPlugin
    ]
  },
  module: {
    /*     rules: [
      // 不能添加babel-loader规则，否则js优化失效 {   test: /\.js$/,   exclude: /node_modules/,
      // use: {     loader: 'babel-loader'   } },

    ] */
  },
  plugins: [
    /*   new ExtractTextPlugin({
    filename: '[name].[contenthash:8].css', allChunks: false, // 制定提取css的范围,提取初始化（非异步加载）,此时在commonChunk插件下，css也会被当成一个chunk,所有要用contenthash
  }), */
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new MiniCssExtractPlugin({ filename: 'css/[name].[chunkhash:8].css', chunkFilename: 'css/[name].[contenthash:8].css' })]
});

module.exports = webpackConfig;
