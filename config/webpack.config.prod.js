const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const baseWebpackConfig = require('./webpack.base.conf');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
};

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: PATHS.dist,
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      // 不能添加babel-loader规则，否则js优化失效
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader'
      //   }
      // },
      // {
      //   test: /\.css$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: {
      //       loader: 'style-loader',
      //       /* options: {
      //        insertInto: 'body',//插入到哪个dom上面
      //        singletom: true, // 把所有的style合成一个
      //        transform: './css.transform.js' // 类似钩子，发生在浏览器环境，可以根据浏览器环境不同做出不同的兼容，例如做media query
      //      }*/
      //     },
      //     use: [
      //       {
      //         loader: 'css-loader',
      //         options: {
      //           minimize: true, // 开启压缩
      //           // module: true// 模块化
      //         },
      //         // loader: 'file-loader',
      //       },
      //       {
      //         loader: 'postcss-loader',
      //         options: {
      //           ident: 'postcss',
      //           plugins: [
      //             // require('autoprefixer')(),
      //             // require('cssnano')(),
      //             require('postcss-cssnext')(),
      //           ],
      //         },
      //       },
      //     ],
      //   }),
      // },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: 'style-loader',
      //     },
      //     {
      //       loader: 'css-loader',
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         ident: 'postcss',
      //         plugins: [
      //           // require('autoprefixer')(), // cssnext 包含autoprefixer
      //           // require('cssnano')(),
      //           require('postcss-cssnext')(),
      //         ],
      //       },
      //     },
      //     {
      //       loader: 'sass-loader',
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css',
      allChunks: false, // 制定提取css的范围,提取初始化（非异步加载）,此时在commonChunk插件下，css也会被当成一个chunk,所有要用contenthash
    }),
  ],
});

module.exports = webpackConfig;
