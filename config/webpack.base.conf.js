const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const packageJson = require('../package.json');

const TARGET = process.env.npm_lifecycle_event;
let isProduction = false;
if (TARGET === 'dev' || TARGET === 'dev:server' || !TARGET) {
  isProduction = false;
}
if (TARGET === 'build' || TARGET === 'stats') {
  isProduction = true;
}
const sourceMapEnabled = !isProduction;

/**
 * 统一处理css-loader
 * @param {*} options
 */
function cssLoaders(options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };
  if (options.modules) {
    cssLoader.options = {
      ...cssLoader.options,
      ...{
        modules: true,
        importLoaders: 1,
        localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
      }
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      ident: 'postcss',
      plugins: [// require('autoprefixer')(), // cssnext 包含autoprefixer require('cssnano')(),
        require('postcss-cssnext')()]
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS
      ? [cssLoader, postcssLoader]
      : [cssLoader];

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {sourceMap: options.sourceMap})
      });
    }

    // Extract CSS when that option is specified (which is the case during
    // production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({use: loaders, fallback: 'style-loader'});
    }
    return ['style-loader'].concat(loaders);
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
}

/* eslint-disable */
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
/* eslint-enable */

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
};

// the path(s) that should be cleaned
const pathsToClean = ['dist/**/*.*'];

// the clean options to use
const cleanOptions = {
  root: path.resolve(__dirname, '../'),
  // verbose: true, dry: false,
};

module.exports = {
  context: path.resolve(__dirname, '../'), // entry 和 module.rules.loader 选项相对于此目录开始解析
  mode: isProduction
    ? 'production'
    : 'development',
  entry: {
    app: [PATHS.src],
    vendors: Object.keys(packageJson.dependencies)
  },
  output: {
    path: PATHS.dist, // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
    filename: '[name].[chunkhash].js',
    publicPath: '/' // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 必须三选一： "initial" | "all"(默认就是all) | "async"
      minSize: 30000, // 最小尺寸，默认0
      minChunks: 1, // 最小 chunk ，默认1
      maxAsyncRequests: 1, // 最大异步请求数， 默认1
      maxInitialRequests: 1, // 最大初始化请求数，默认1
      name: () => {}, // 名称，此选项课接收 function
      cacheGroups: {
        // 这里开始设置缓存的 chunks
        priority: '0', // 缓存组优先级 false | object |
        vendors: {
          // key 为entry中定义的 入口名称
          test: /react|react-dom|lodash|antd/, // 正则规则验证，如果符合就提取 chunk
          name: 'vendors', // 要缓存的 分隔出来的 chunk 名称
          minSize: 0,
          minChunks: 1,
          enforce: true,
          chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          maxAsyncRequests: 1, // 最大异步请求数， 默认1
          maxInitialRequests: 1, // 最大初始化请求数，默认1
          reuseExistingChunk: true, // 可设置是否重用该chunk（查看源码没有发现默认值）
        },
        styles: {
          name: 'styles',
          test: /(\.scss|\.less|\.css)$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  resolve: {
    extensions: [
      '.js', '.jsx', '.vue'
    ],
    modules: [
      path.resolve(__dirname, '../node_modules'),
      PATHS.src
    ],
    alias: {
      '@': PATHS.src,
      "actions": path.resolve(__dirname, "../src/actions"),
      "components": path.resolve(__dirname, "../src/components"),
      "containers": path.resolve(__dirname, "../src/containers"),
      "reducers": path.resolve(__dirname, "../src/reducers"),
      "utils": path.resolve(__dirname, "../src/utils")
    }
  },
  module: {
    rules: [
      {
        // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
        test: /\.js?$/,
        enforce: "pre",
        loader: "eslint-loader",
        include: PATHS.src
      }, {
        // .js .jsx用babel解析
        test: /\.js?$/,
        include: PATHS.src,
        loader: "babel-loader"
      }, {
        test: /\.css$/,
        use: cssLoaders({sourceMap: sourceMapEnabled, extract: isProduction, usePostCSS: true, modules: true}).css,
        include: PATHS.src
      }, {
        test: /\.css$/,
        use: cssLoaders({sourceMap: sourceMapEnabled, extract: isProduction, usePostCSS: true, modules: false}).css,
        include: resolve("node_modules")
      }, {
        test: /\.scss$/,
        use: cssLoaders({sourceMap: sourceMapEnabled, extract: isProduction, usePostCSS: true, modules: true}).scss
      }, {
        test: /\.less$/,
        use: cssLoaders({sourceMap: sourceMapEnabled, extract: isProduction, usePostCSS: true, modules: true}).less,
        include: PATHS.src
      }, {
        test: /\.less$/, // (用于解析antd的LESS文件)
        use: cssLoaders({sourceMap: sourceMapEnabled, extract: isProduction, usePostCSS: true, modules: false}).less,
        include: resolve("node_modules")
      }, {
        // 文件解析
        test: /\.(eot|woff|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: PATHS.src,
        loader: "file-loader?name=assets/[name].[ext]"
      }, {
        // 图片解析
        test: /\.(png|jpg|gif)$/,
        include: PATHS.src,
        loader: "url-loader?limit=8192&name=assets/[name].[ext]"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    // new webpack.NoEmitOnErrorsPlugin(), // 在编译出现错误时，自动跳过输出阶段。这样可以确保编译出的资源中不会包含错误。

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
          content: 'A better default template for html-webpack-plugin.'
        }, {
          name: 'robots',
          content: 'noindex,nofollow'
        }
      ],
      mobile: true,
      lang: 'en-US',
      inlineManifestWebpackName: 'webpackManifest',
      minify: {
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        useShortDoctype: true,
        html5: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(PATHS.src, 'favicon.ico'),
        to: path.join(PATHS.dist, 'favicon.ico')
      }
    ])
  ]
};
