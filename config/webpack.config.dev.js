const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const package = require('../package.json');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
  // faviconPath: path.join(__dirname, '../src/favicon.ico')
};

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: {
    app: [PATHS.src],
    vendors: Object.keys(package.dependencies)
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js',
    publicPath: '/'
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         enfore: true,
  //         chunks: 'all'
  //       }
  //     }
  //   }
  // },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.json', 'jsm']
  },
  devtool: 'eval',
  plugins: [
    new HtmlWebpackPlugin({
      // Required
      inject: false,
      // template: require('html-webpack-template'),
      template: '../node_modules/html-webpack-template/index.ejs',

      // Optional
      appMountId: 'app',
      title: 'Webpack 4 demo',
      favicon: path.join(PATHS.src, 'favicon.ico'),
      meta: [
        {
          name: 'description',
          content: 'A better default template for html-webpack-plugin.'
        },
        { name: 'robots', content: 'noindex,nofollow' }
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
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(PATHS.src, 'favicon.ico'),
        to: path.join(PATHS.dist, 'favicon.ico')
      }
    ])
  ],
  devServer: {
    contentBase: PATHS.dist,
    compress: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    },
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    port: 8080,
    publicPath: 'http://localhost:8080/',
    hot: true
  },
  stats: {
    children: false
  }
};
