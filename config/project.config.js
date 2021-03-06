const path = require('path')

const isProduction = process.env.NODE_ENV == 'production'
const sourceMapEnabled = !isProduction

module.exports = {
  env: isProduction ? 'production' : 'development',
  basePath: path.resolve(__dirname, '../'),
  srcDir: path.resolve(__dirname, '../src'),
  outDir: path.resolve(__dirname, '../dist'),
  publicPath: './',
  sourceMap: sourceMapEnabled,
  esLint: true,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  vendor: ['react', 'react-dom', 'react-router-dom']
  // 当 (dll不存在) (vendor被改变) (包的版本被更换) 时，请 npm run dll。
}
