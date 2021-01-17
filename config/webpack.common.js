const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { srcPath } = require('./paths');

module.exports = {
  // 单入口写法
  // entry: path.join(srcPath, 'index'),

  // 多入口写法
  entry: {
    index: path.join(srcPath, 'index'),
    other: path.join(srcPath, 'other'),
  },

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
    // 多入口 - 生成 index.html
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',

      // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
      chunks: ['index']  // 只引用 index.js
    }),

    // 多入口 - 生成 other.html
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'other.html'),
      filename: 'other.html',
      chunks: ['other']  // 只引用 other.js
    })
  ]
}
