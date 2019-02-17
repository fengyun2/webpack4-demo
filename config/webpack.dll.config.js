/* 暂时废弃，改为由autodll-webpack-plugin插件自动生成dll文件并插入到index.html */
const path = require('path')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const { vendor, basePath, srcDir } = require('./project.config')

module.exports = {
  mode: 'production',
  entry: {
    vendor // vendor 模块打包到一个动态连接库
  },
  output: {
    path: path.resolve(basePath, 'dll'),
    filename: '[name].dll.js', // 输出动态连接库的文件名称
    library: '[name]_library' // 全局变量名称
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    modules: [path.resolve(__dirname, '../node_modules'), srcDir],
    alias: {
      '@': srcDir,
      vue: 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new WebpackBar({
      minimal: false,
      compiledIn: false
    }),
    new webpack.DllPlugin({
      name: '[name]_library', // 和output.library中一致，也就是输出的manifest.json中的 name值
      path: path.resolve(basePath, 'dll', '[name].manifest.json'),
      context: basePath
    })
  ]
}
