const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack')
const webpack = require('webpack')
const path = require('path')
const os = require('os')

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

const project = require('./project.config')

// const packageJson = require('../package.json');

const TARGET = process.env.npm_lifecycle_event
let isProduction = false
if (TARGET === 'dev' || TARGET === 'dev:server' || !TARGET) {
  isProduction = false
}
if (TARGET === 'build' || TARGET === 'stats') {
  isProduction = true
}
const sourceMapEnabled = !isProduction

/**
 * 统一处理css-loader
 * @param {*} options
 */
function cssLoaders(options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  if (options.modules) {
    cssLoader.options = {
      ...cssLoader.options,
      ...{
        modules: true,
        importLoaders: 1,
        localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
      }
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      ident: 'postcss',
      plugins: [
        /*         // cssnext 包含autoprefixer require('cssnano')(),
        require('postcss-cssnext')(), */
        // eslint-disable-next-line
        require('postcss-preset-env')()
      ]
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, { sourceMap: options.sourceMap })
      })
    }

    // Extract CSS when that option is specified (which is the case during
    // production build)
    if (options.extract) {
      loaders.unshift(MiniCssExtractPlugin.loader)

      return loaders
      // return ExtractTextPlugin.extract({use: loaders, fallback: 'style-loader'});
    }
    return ['style-loader'].concat(loaders)
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

/* eslint-disable */
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
/* eslint-enable */

const webpackConfig = {
  context: project.basePath, // entry 和 module.rules.loader 选项相对于此目录开始解析
  mode: isProduction ? 'production' : 'development',
  cache: {
    type: 'filesystem'
  },
  entry: {
    app: [project.srcDir],
    vendors: project.vendors
    // vendors: Object.keys(packageJson.dependencies) // 已存在dll文件打包了
  },
  output: {
    path: project.outDir, // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
    filename: '[name].[chunkhash].js',
    publicPath: '/' // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
  },
  /*   optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    // minimizer: true, // [new UglifyJsPlugin({...})]
    splitChunks: {
      chunks: 'all', // 必须三选一： "initial" | "all"(默认就是all) | "async"
      minSize: 30000, // 最小尺寸，默认0
      minChunks: 1, // 最小 chunk ，默认1
      maxAsyncRequests: 1, // 最大异步请求数， 默认1(目前改为其他值会导致页面加载不出来)
      maxInitialRequests: 1, // 最大初始化请求数，默认1
      name: () => { }, // 名称，此选项可接收 function
      cacheGroups: {
        // 这里开始设置缓存的 chunks
        priority: '0', // 缓存组优先级 false | object |
        //         commons: {
        //   chunks: "initial",
        //   minChunks: 2,
        //   maxInitialRequests: 5, // The default limit is too small to showcase the effect
        //   minSize: 0 // This is example is too small to create commons chunks
        // },
        // 已存在dll文件打包了
        vendors: {
          // key 为entry中定义的 入口名称
          test: /node_modules\/(.*)\.js/, // 正则规则验证，如果符合就提取 chunk
          name: 'vendors', // 要缓存的 分隔出来的 chunk 名称
          priority: -10,
          minSize: 0,
          minChunks: 1,
          enforce: true,
          chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
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
  }, */
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    modules: [path.resolve(__dirname, '../node_modules'), project.srcDir],
    alias: {
      '@': project.srcDir,
      vue: 'vue/dist/vue.esm.js',
      actions: path.resolve(__dirname, '../src/actions'),
      components: path.resolve(__dirname, '../src/components'),
      containers: path.resolve(__dirname, '../src/containers'),
      reducers: path.resolve(__dirname, '../src/reducers'),
      utils: path.resolve(__dirname, '../src/utils')
    }
  },
  module: {
    rules: [
      {
        // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
        test: /\.js?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: project.srcDir
      },
      /*        {
        // .js .jsx用babel解析
        test: /\.js?$/,
        include: project.srcDir,
        loader: 'babel-loader'
      }, */
      {
        test: /\.js?$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        include: project.srcDir,
        exclude: /node_modules/,
        use: 'happypack/loader?id=babel'
      },
      {
        test: /\.css$/,
        use: cssLoaders({
          sourceMap: sourceMapEnabled,
          extract: isProduction,
          usePostCSS: true,
          modules: true
        }).css,
        include: project.srcDir
      },
      {
        test: /\.css$/,
        use: cssLoaders({
          sourceMap: sourceMapEnabled,
          extract: isProduction,
          usePostCSS: true,
          modules: false
        }).css,
        include: resolve('node_modules')
      },
      {
        test: /\.scss$/,
        use: cssLoaders({
          sourceMap: sourceMapEnabled,
          extract: isProduction,
          usePostCSS: true,
          modules: true
        }).scss
      },

      {
        test: /\.less$/,
        use: cssLoaders({
          sourceMap: sourceMapEnabled,
          extract: isProduction,
          usePostCSS: true,
          modules: true
        }).less,
        include: project.srcDir
      },
      /*       {
        test: /\.less$/, // (用于解析antd的LESS文件)
        use: cssLoaders({
          sourceMap: sourceMapEnabled, extract: isProduction, usePostCSS: true, modules: false
        }).less,
        include: resolve('node_modules')
      }, */
      {
        test: /\.less?$/, // (用于解析antd的LESS文件)
        // 把对 .less 文件的处理转交给 id 为 less 的 HappyPack 实例
        include: resolve('node_modules'),
        use: 'happypack/loader?id=node_modules_less'
      },
      {
        // 文件解析
        test: /\.(eot|woff|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: project.srcDir,
        loader: 'file-loader?name=assets/[name].[ext]'
      },
      {
        // 图片解析
        test: /\.(png|jpg|gif)$/,
        include: project.srcDir,
        loader: 'url-loader?limit=8192&name=assets/[name].[ext]'
      }
    ]
  },
  plugins: [
    // new webpack.NoEmitOnErrorsPlugin(), // 在编译出现错误时，自动跳过输出阶段。这样可以确保编译出的资源中不会包含错误。
    new webpack.DllReferencePlugin({
      context: project.basePath,
      // eslint-disable-next-line
      manifest: require(path.resolve(project.basePath, 'dll', 'vendors.manifest.json'))
    }),
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      threadPool: happyThreadPool,
      verbose: true,
      // threads: 4, // 不知为何写了threads 反而变慢了
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory']
    }),

    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'node_modules_less',
      threads: 2, // 不知为何写了threads 反而变慢了
      // threadPool: happyThreadPool,
      verbose: true,
      // 如何处理 .less 文件，用法和 Loader 配置中一样
      loaders: cssLoaders({
        sourceMap: sourceMapEnabled,
        extract: isProduction,
        usePostCSS: true,
        modules: false
      }).less
    }),
    new HtmlWebpackPlugin({
      // Required
      inject: false,
      // template: require('html-webpack-template'),
      template: 'node_modules/html-webpack-template/index.ejs',

      // Optional
      appMountId: 'app',
      title: 'Webpack 4 demo',
      favicon: path.join(project.srcDir, 'favicon.ico'),
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
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        useShortDoctype: true,
        html5: true
      },
      scripts: ['./dll/vendors.dll.js'] // 与dll配置文件中output.fileName对齐
    }),

    new CopyWebpackPlugin([
      {
        from: path.join(project.srcDir, 'favicon.ico'),
        to: path.join(project.outDir, 'favicon.ico')
      },
      {
        from: path.join(project.basePath, 'dll'),
        to: path.join(project.basePath, 'dist', 'dll')
      }
    ])
  ]
}

module.exports = webpackConfig
