const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 生产环境 css 拆分

// 压缩 css
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpackCommonConf = require('./webpack.common.js');
const { merge } = require("webpack-merge");
const { distPath } = require('./paths');

module.exports = merge(webpackCommonConf, {
  mode: 'production',
  output: {
    // 单入口
    // filename: 'bundle.[contenthash:8].js',  // 打包代码时，加上 hash 戳

    // 多入口
    filename: '[name].[contenthash:8].js',   // name 即多入口时候 entry 的 key
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
      },
      {
        test: /\.css$/,

        // 多个 loader 使用 use
        use: [
          MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
          'css-loader', 
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,

        // loader 的执行顺序：从后往前
        use: [
          MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
          'css-loader', 
          'postcss-loader', 
          'less-loader',
        ],
      }
    ]
  },
  plugins: [
    // 会默认清空 output.path 文件夹
    new CleanWebpackPlugin(),

    new webpack.DefinePlugin({
        // window.ENV = 'production'
        ENV: JSON.stringify('production')
    }),

    // 抽离 css
    new MiniCssExtractPlugin({
      // 加 name 对于多页面开发的时候每个页面只会引入自己所需要的 css
      filename: 'css/[name].[contenthash:8].css',
    }),
  ],
  optimization: {
    // 压缩 css
    minimizer: [
      new TerserJSPlugin({}), 
      new OptimizeCSSAssetsPlugin({})
    ],
  }
})
