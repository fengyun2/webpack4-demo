const path = require('path')

const TARGET = process.env.npm_lifecycle_event
let isProduction = false
if (TARGET === 'dev' || TARGET === 'dev:server' || !TARGET) {
  isProduction = false
}
if (TARGET === 'build' || TARGET === 'stats') {
  isProduction = true
}

const sourceMapEnabled = !isProduction

module.exports = {
  env: isProduction ? 'production' : 'development',
  basePath: path.resolve(__dirname, '../'),
  srcDir: path.resolve(__dirname, '../src'),
  outDir: path.resolve(__dirname, '../dist'),
  publicPath: './',
  sourceMap: sourceMapEnabled,
  esLint: true,
  externals: {},
  vendor: ['react', 'react-dom', 'react-loadable']
  // 当 (dll不存在) (vendor被改变) (包的版本被更换) 时，请 npm run dll。
}
