
//const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');
var path = require('path')
//var webpack = require('webpack')
/*
const config = {
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        })
    ]
};

module.exports = config;*/

module.exports = {
    
    output: {
        filename: 'bundle.js'
    },

    plugins: [
      new UglifyJSPlugin({
          sourceMap: true
      })
    ],
    /*
    entry: {
      entry: './src/scripts/main.js',
      app: './src/scripts/app.js',
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/dist/',
      filename: '[name].bundle.js'
    },
    */
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ],
        },      {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
            }
            // other vue-loader options go here
          }
        },
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        },
        {
          test: /\.(frag|vert)$/,
          loader: 'webpack-glsl-loader'
      },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
      historyApiFallback: true,
      noInfo: false,
      overlay: true
    },
    performance: {
      hints: false
    },
    devtool: '#eval-source-map'
  }
  
  if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ])
  }
  