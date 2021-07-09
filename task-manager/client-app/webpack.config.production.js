
var path = require('path');
var webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(path.join(__dirname, 'public' , 'index.html'));

module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, 'src' , 'index.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: './public/favicon.ico'
    })
],
  resolve: {
    root: [path.resolve('./public/utils'), path.resolve('./public')],
    extensions: ['', '.js', '.css']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: path.join(__dirname, 'src')
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"]
    },
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "sass-loader?indentedSyntax"
      ]
    },
    {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader'
    },
    {
      test: /\.(jpg|jpeg|gif|png|ico|ttf|otf|eot|svg|woff|woff2)(\?[a-z0-9]+)?$/,
      loader: 'file-loader?name=[path][name].[ext]'
    }]
  }
};