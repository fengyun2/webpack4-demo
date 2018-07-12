const path = require('path');
const webpack = require('webpack');
const project = require('./project.config')

module.exports = {
  entry: {
    vendors: project.vendors // vendors 模块打包到一个动态连接库
  },
  output: {
    path: path.resolve(project.basePath, 'dll'),
    filename: '[name].dll.js', // 输出动态连接库的文件名称
    library: '[name]_library' // 全局变量名称
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library', // 和output.library中一致，也就是输出的manifest.json中的 name值
      path: path.resolve(project.basePath, 'dll', '[name].manifest.json'),
      context: project.basePath
    })
  ]
};
