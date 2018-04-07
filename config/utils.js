const path = require('path')
const config = require('./config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = config.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

/**
 * 统一处理css-loader
 * @param {*} options
 */
exports.cssLoaders = function (options) {
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
        localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
      }
    };
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      ident: 'postcss',
      // plugins: [
      //   require('postcss-cssnext')()
      // ]
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
      return ExtractTextPlugin.extract({ use: loaders, fallback: 'style-loader' });
      // return [MiniCssExtractPlugin.loader,'style-loader'].concat(loaders)
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
    styl: generateLoaders('stylus')
  };
}
