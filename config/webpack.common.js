const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { srcPath } = require('./paths');

module.exports = {
  entry: path.join(srcPath, 'index'),
  module: {
    rules: [
      {
        test: /\.js$/,

        // 单个 loader 使用 loader 属性，另外要装 @babel/core、@babel/preset-env 同时配置 .babelrc 文件
        loader: 'babel-loader',
        include: srcPath,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,

        // 多个 loader 使用 use
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,

        // loader 的执行顺序：从后往前
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',
    })
  ]
}
