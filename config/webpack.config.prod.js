const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin') // 生成一个server-worker用于缓存
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const baseWebpackConfig = require('./webpack.base.conf')
const { basePath, vendor, outDir } = require('./project.config')

// the path(s) that should be cleaned
const pathsToClean = ['dist/**/*.*']

// the clean options to use
const cleanOptions = {
  root: path.resolve(__dirname, '../')
  // verbose: true, dry: false,
}

/**
 * 基础路径
 * 比如我上传到自己的服务器填写的是："/work/pwa/"，最终访问为"https://webpack.com/work/pwa/#/"
 * 根据你自己的需求填写
 * "/" 就是根路径，假如最终项目上线的地址为：https://webpack.com/， 那就可以直接写"/"
 * * */
const PUBLIC_PATH = '/'

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
    /**
     * 在window环境中注入全局变量
     * 这里这么做是因为src/serviceWorker.js中有用到，为了配置PWA
     * */
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        PUBLIC_URL: PUBLIC_PATH.replace(/\/$/, '')
      })
    }),
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
    new PrerenderSPAPlugin({
      routes: ['/'],
      staticDir: path.join(basePath, 'dist')
    }),
    // 生成一个server-work用于缓存资源（PWA）
    new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          return
        }
        if (message.indexOf('Skipping static resource') === 0) {
          return
        }
        console.log(message)
      },
      minify: true, // 压缩
      navigateFallback: PUBLIC_PATH, // 遇到不存在的URL时，跳转到主页
      navigateFallbackWhitelist: [/^(?!\/__).*/], // 忽略从/__开始的网址，参考 https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/, /\.cache$/] // 不缓存sourcemaps,它们太大了
    }),
    // 这里是用于把manifest.json打包时复制到/dist下 （PWA）
    new CopyWebpackPlugin([
      { from: path.join(basePath, './public/manifest.json'), to: path.join(outDir, './manifest.json') }
    ]),
    new CleanWebpackPlugin(pathsToClean, cleanOptions)
  ],
  optimization: {
    sideEffects: false,
    splitChunks: {
      // chunks: 'all',
      // minSize: 30000,
      // minChunks: 1,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
})

module.exports = webpackConfig
