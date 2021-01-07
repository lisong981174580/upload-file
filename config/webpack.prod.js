const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackCommonConf = require('./webpack.common.js');
const { merge } = require("webpack-merge");
const { distPath } = require('./paths');

module.exports = merge(webpackCommonConf, {
  mode: 'production',
  output: {
    filename: 'bundle.[contenthash:8].js',  // 打包代码时，加上 hash 戳
    path: distPath,
  },
  module: {
    rules: [
      // 图片 - 考虑 base64 编码的情况
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',

            // 可以对 loader 配置参数
            options: {
              // 小于 5kb 的图片用 base64 格式产出
              // 否则，依然延用 file-loader 的形式，产出 url 格式
              limit: 5 * 1024,
  
              // 打包到 img 目录下
              outputPath: '/img1/',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 会默认清空 output.path 文件夹
    new CleanWebpackPlugin(),

    new webpack.DefinePlugin({
        // window.ENV = 'production'
        ENV: JSON.stringify('production')
    })
  ]
})
