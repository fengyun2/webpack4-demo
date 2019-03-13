const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintFormatter = require('eslint-friendly-formatter');
const { VueLoaderPlugin } = require('vue-loader');
const WebpackBar = require('webpackbar');
// const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin'); // 自动生成各尺寸的favicon图标
const HappyPack = require('happypack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const webpack = require('webpack')
const path = require('path');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

const {
  sourceMap, esLint, basePath, srcDir, outDir, vendor
} = require('./project.config');

const isProduction = process.env.NODE_ENV == 'production';

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
        localIdentName: '[name]__[local]--[hash:base64:5]'
      }
    };
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      ident: 'postcss',
      plugins: [
        // eslint-disable-next-line
        require('postcss-preset-env')()
      ]
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, { sourceMap: options.sourceMap })
      });
    }

    // Extract CSS when that option is specified (which is the case during
    // production build)
    if (options.extract) {
      loaders.unshift(MiniCssExtractPlugin.loader);

      return loaders;
      // return ExtractTextPlugin.extract({use: loaders, fallback: 'style-loader'});
    }
    // mini-css-extract-plugin 不支持css热更新。因此需在开发环境引入 css-hot-loader，以便支持css热更新
    return ['css-hot-loader', 'style-loader'].concat(loaders);
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', { javascriptEnabled: true }),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
}

const ESLintRule = () => ({
  test: /\.jsx?$/,
  use: {
    loader: 'eslint-loader?cacheDirectory',
    options: {
      formatter: ESLintFormatter
    }
  },
  enforce: 'pre',
  include: srcDir,
  exclude: /node_modules/
});

/* eslint-disable */
function resolve(dir) {
  return path.resolve(__dirname, '..', dir);
}
/* eslint-enable */

const webpackConfig = {
  context: basePath, // entry 和 module.rules.loader 选项相对于此目录开始解析
  mode: isProduction ? 'production' : 'development',
  cache: {
    type: 'filesystem'
  },
  entry: {
    app: [path.resolve(srcDir, 'index.js')] // react
    // app: [path.resolve(srcDir, 'vue_index.js')] // vue
  },
  output: {
    path: outDir, // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
    filename: '[name].[chunkhash].js',
    publicPath: '/' // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.less'],
    modules: [srcDir, 'node_modules'], // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
    // mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
    alias: {
      '@': srcDir, // 缓存src目录为@符号，避免重复寻址
      vue: 'vue/dist/vue.esm.js',
      actions: resolve('src/actions'),
      components: resolve('src/components'),
      containers: resolve('src/containers'),
      reducers: resolve('src/reducers'),
      utils: resolve('src/utils')
    },
    plugins: [PnpWebpackPlugin]
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)]
  },
  module: {
    // noParse: /jquery|lodash/, // 忽略未采用模块化的文件，因此jquery或lodash将不会被下面的loaders解析
    rules: [
      ...(esLint ? [ESLintRule()] : []),

      {
        test: /\.jsx?$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        include: srcDir,
        exclude: /node_modules/,
        use: 'happypack/loader?id=babel'
      },
      {
        test: /\.vue$/,
        include: srcDir,
        exclude: /node_modules/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: cssLoaders({
          sourceMap,
          extract: isProduction,
          usePostCSS: true,
          modules: true // modules若设置为true后，vue中的样式会丢失，切记切记！！！
        }).css,
        include: srcDir
      },
      {
        test: /\.css$/,
        use: cssLoaders({
          sourceMap,
          extract: isProduction,
          usePostCSS: true,
          modules: false
        }).css,
        include: resolve('node_modules')
      },
      {
        test: /\.scss$/,
        use: cssLoaders({
          sourceMap,
          extract: isProduction,
          usePostCSS: true,
          modules: true
        }).scss
      },

      {
        test: /\.less$/,
        use: cssLoaders({
          sourceMap,
          extract: isProduction,
          usePostCSS: true,
          modules: true
        }).less,
        include: srcDir
      },
      {
        test: /\.less?$/, // (用于解析antd的LESS文件)
        // 把对 .less 文件的处理转交给 id 为 less 的 HappyPack 实例
        include: [resolve('node_modules/antd')],
        // use: 'happypack/loader?id=node_modules_less'
        use: cssLoaders({
          sourceMap,
          extract: isProduction,
          usePostCSS: true,
          modules: false
        }).less
      },
      {
        // 文件解析
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        include: srcDir,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: isProduction ? 'fonts/[name].[hash:7].[ext]' : 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        // 图片解析
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        include: srcDir,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: isProduction ? 'images/[name].[hash:8].[ext]' : 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        // 文件解析
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|pdf)(\?.*)?$/,
        include: srcDir,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10,
            name: isProduction ? 'media/[name].[hash:7].[ext]' : 'media/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    // new webpack.NoEmitOnErrorsPlugin(), // 在编译出现错误时，自动跳过输出阶段。这样可以确保编译出的资源中不会包含错误。
    // new webpack.DllReferencePlugin({
    //   context: basePath,
    //   // eslint-disable-next-line
    //   manifest: require(path.resolve(basePath, 'dll', 'vendor.manifest.json'))
    // }),
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      threadPool: happyThreadPool,
      verbose: true,
      // threads: 4, // 不知为何写了threads 反而变慢了
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory']
    }),
    // 暂停使用happypack编译less: https://github.com/amireh/happypack/issues/223
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'node_modules_less',
      threads: 2, // 不知为何写了threads 反而变慢了
      // threadPool: happyThreadPool,
      verbose: true,
      // 如何处理 .less 文件，用法和 Loader 配置中一样
      loaders: cssLoaders({
        sourceMap,
        extract: isProduction,
        usePostCSS: false, // 编译 antd less时无法引入postcss
        modules: false
      }).less
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    }),
    new HtmlWebpackPlugin({
      // Required
      inject: true, // 是否将js放在body的末尾
      hash: false, // 防止缓存，在引入的文件后面加hash (PWA就是要缓存，这里设置为false)
      // template: require('html-webpack-template'),
      // template: 'node_modules/html-webpack-template/index.ejs',
      template: path.join(basePath, 'public/index.html'),
      filename: 'index.html', // 生成的html存放路径，相对于 output.path

      // Optional
      appMountId: 'app',
      title: 'React App',
      favicon: path.join(basePath, 'public/favicon.png'),
      meta: [
        {
          name: 'description',
          content: 'A better default template for html-webpack-plugin.'
        },
        {
          name: 'robots',
          content: 'noindex,nofollow'
        }
      ],
      mobile: true,
      lang: 'en-US',
      inlineManifestWebpackName: 'webpackManifest',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        useShortDoctype: true,
        html5: true
      },
      chunksSortMode: 'dependency'
      // scripts: ['./dll/vendor.dll.js'] // 与dll配置文件中output.fileName对齐
    }),
    // AutoDllPlugin: 每次打包，这个插件都会检查注册在 entry 中的第三方库是否发生了变化，如果没有变化，插件就会使用缓存中的打包文件，减少了打包的时间，这时 Hash 也不会变化
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundles to index.html(插件会自动把打包出来的第三方库文件插入到 HTML)
      debug: isProduction,
      filename: '[name]_[hash].dll.js',
      path: './dll',
      entry: {
        vendor // vendor 是你指定的名称，数组内容就是要打包的第三方库的名称，不要写全路径，Webpack 会自动去 node_modules 中找到的
      }
    }),
    // 自动生成各种类型的favicon，这么做是为了以后各种设备上的扩展功能，比如PWA桌面图标
    // new FaviconsWebpackPlugin({
    //   logo: path.join(basePath, 'public/favicon.png'),
    //   prefix: 'icons/',
    //   // Generate a cache file with control hashes and
    //   // don't rebuild the favicons until those hashes change
    //   persistentCache: false,
    //   // Inject the html into the html-webpack-plugin
    //   inject: true,
    //   icons: {
    //     appleIcon: true, // 目前只生成苹果的，其他平台都用苹果的图标
    //     android: false,
    //     firefox: false,
    //     appleStartup: false
    //   }
    // }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new HtmlWebpackIncludeAssetsPlugin({
    //   assets: ['./dll/vendor.dll.js'],
    //   append: false
    // }),
    new VueLoaderPlugin(),
    // new CopyWebpackPlugin([
    // {
    //   from: path.join(srcDir, 'favicon.ico'),
    //   to: path.join(outDir, 'favicon.ico')
    // }
    // {
    //   from: path.join(basePath, 'dll'),
    //   to: path.join(basePath, 'dist', 'dll')
    // }
    // ]),
    new WebpackBar({
      minimal: false,
      compiledIn: false
    })
  ],
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: false
};

module.exports = webpackConfig;
