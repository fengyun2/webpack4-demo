const path = require('path');

const TARGET = process.env.npm_lifecycle_event;
let isProduction = false;
if (TARGET === 'dev' || TARGET === 'dev:server' || !TARGET) {
  isProduction = false;
}
if (TARGET === 'build' || TARGET === 'stats') {
  isProduction = true;
}

const sourceMapEnabled = !isProduction;

module.exports = {
  env: isProduction
    ? 'production'
    : 'development',
  basePath: path.join(__dirname, '../'),
  srcDir: path.join(__dirname, '../src'),
  outDir: path.join(__dirname, '../dist'),
  publicPath: './',
  sourceMap: sourceMapEnabled,
  externals: {},
  vendors: ['react', 'react-dom', 'react-loadable']
}
