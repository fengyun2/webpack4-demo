const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const package = require('../package.json');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  // faviconPath: path.join(__dirname, '../src/favicon.ico')
};

// the path(s) that should be cleaned
const pathsToClean = ['dist/**/*.*'];

// the clean options to use
const cleanOptions = {
  root: path.resolve(__dirname, '../'),
  // verbose: true,
  // dry: false,
};

module.exports = {
  context: path.resolve(__dirname, '../'),
  mode: 'production',
  entry: {
    app: [PATHS.src],
    vendors: Object.keys(package.dependencies),
  },
  output: {
    path: PATHS.dist,
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'initial', // 必须三选一： "initial" | "all"(默认就是all) | "async"
      minSize: 0, // 最小尺寸，默认0
      minChunks: 1, // 最小 chunk ，默认1
      maxAsyncRequests: 1, // 最大异步请求数， 默认1
      maxInitialRequests: 1, // 最大初始化请求数，默认1
      name: () => {}, // 名称，此选项课接收 function
      cacheGroups: {
        // 这里开始设置缓存的 chunks
        priority: '0', // 缓存组优先级 false | object |
        vendors: {
          // key 为entry中定义的 入口名称
          test: /[\\/]node_modules[\\/]/, // 正则规则验证，如果符合就提取 chunk
          name: 'vendors', // 要缓存的 分隔出来的 chunk 名称
          minSize: 0,
          minChunks: 1,
          enforce: true,
          chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          maxAsyncRequests: 1, // 最大异步请求数， 默认1
          maxInitialRequests: 1, // 最大初始化请求数，默认1
          reuseExistingChunk: true, // 可设置是否重用该chunk（查看源码没有发现默认值）
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.json', 'jsm'],
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
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            /* options: {
             insertInto: 'body',//插入到哪个dom上面
             singletom: true, // 把所有的style合成一个
             transform: './css.transform.js' // 类似钩子，发生在浏览器环境，可以根据浏览器环境不同做出不同的兼容，例如做media query
           }*/
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true, // 开启压缩
                // module: true// 模块化
              },
              // loader: 'file-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  // require('autoprefixer')(),
                  // require('cssnano')(),
                  require('postcss-cssnext')(),
                ],
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                // require('autoprefixer')(), // cssnext 包含autoprefixer
                // require('cssnano')(),
                require('postcss-cssnext')(),
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css',
      allChunks: false, // 制定提取css的范围,提取初始化（非异步加载）,此时在commonChunk插件下，css也会被当成一个chunk,所有要用contenthash
    }),
    new HtmlWebpackPlugin({
      // Required
      inject: false,
      // template: require('html-webpack-template'),
      template: 'node_modules/html-webpack-template/index.ejs',

      // Optional
      appMountId: 'app',
      title: 'Webpack 4 demo',
      favicon: path.join(PATHS.src, 'favicon.ico'),
      meta: [
        {
          name: 'description',
          content: 'A better default template for html-webpack-plugin.',
        },
        { name: 'robots', content: 'noindex,nofollow' },
      ],
      mobile: true,
      lang: 'en-US',
      inlineManifestWebpackName: 'webpackManifest',
      minify: {
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        useShortDoctype: true,
        html5: true,
      },
    }),
    // new webpack.optimize.UglifyJsPlugin(),
    // new PurifyCSSPlugin({
    //   // Give paths to parse for rules. These should be absolute!
    //   paths: glob.sync(path.join(__dirname, '/*.html'))
    //   // paths: glob.sync(path.join(__dirname, '/src/index.js')),
    // }),
    new CopyWebpackPlugin([
      {
        from: path.join(PATHS.src, 'favicon.ico'),
        to: path.join(PATHS.dist, 'favicon.ico'),
      },
    ]),
  ],
};
