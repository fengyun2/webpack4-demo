const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const path = require('path');

const baseWebpackConfig = require('./webpack.base.conf');
const utils = require('./utils')

const bundleAnalyzerReport = process.env.npm_config_report;

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
};

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: PATHS.dist,
    // filename: '[name].[chunkhash].js',
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    publicPath: '/'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        js: {
          test: /\.js$/,
          name: "commons",
          chunks: "all",
          minChunks: 7,
        },
        css: {
          test: /\.(css|less|sass|scss)$/,
          name: "commons",
          chunks: "all",
          minChunks: 2,
        }
      }
    }
  },
  module: {
    rules: [
      // 不能添加babel-loader规则，否则js优化失效 {   test: /\.js$/,   exclude: /node_modules/,
      // use: {     loader: 'babel-loader'   } },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      // filename: '[name].[md5:contenthash:hex:20].css', // webpack4.3以上版本存在bug
      filename: utils.assetsPath('css/[name].[md5:contenthash:hex:20].css'),
      allChunks: false // 制定提取css的范围,提取初始化（非异步加载）,此时在commonChunk插件下，css也会被当成一个chunk,所有要用contenthash
    }),
    // new MiniCssExtractPlugin({
    //   filename: "[name].css",
    //   chunkFilename: "[id].css",
    //   // allChunks: false
    // })
  ]
});

if (bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
module.exports = webpackConfig;
