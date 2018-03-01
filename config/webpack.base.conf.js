const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
      sourceMap: options.sourceMap,
    },
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      ident: 'postcss',
      plugins: [
        // require('autoprefixer')(), // cssnext 包含autoprefixer
        // require('cssnano')(),
        require('postcss-cssnext')(),
      ],
    },
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader',
      });
    }
    return ['style-loader'].concat(loaders);
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
}

/* eslint-disable */
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
/* eslint-enable */

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
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
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: [PATHS.src],
    vendors: Object.keys(packageJson.dependencies),
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
      {
        test: /\.css$/,
        use: cssLoaders({
          sourceMap: sourceMapEnabled,
          extract: isProduction,
        }).css,
      },
      {
        test: /\.scss$/,
        use: cssLoaders({
          sourceMap: sourceMapEnabled,
          extract: isProduction,
          usePostCSS: true,
        }).scss,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
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
    new CopyWebpackPlugin([
      {
        from: path.join(PATHS.src, 'favicon.ico'),
        to: path.join(PATHS.dist, 'favicon.ico'),
      },
    ]),
  ],
};
