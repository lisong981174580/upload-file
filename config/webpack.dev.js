const webpack = require('webpack');
const webpackCommonConf = require('./webpack.common.js');
const { merge } = require("webpack-merge");
const { distPath } = require('./paths');
const path = require('path');

module.exports = merge(webpackCommonConf, {
  mode: 'development',
  module: {
    // 直接引入图片
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file-loader',
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
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // window.ENV = 'development'
      ENV: JSON.stringify('development')
    })
  ],
  devServer: {
    port: 8080,
    progress: true,  // 显示打包的进度条
    contentBase: distPath,  // 根目录
    // open: true,  // 自动打开浏览器
    compress: true,  // 启动 gzip 压缩

    // 设置代理
    proxy: {
      // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
      // '/api': 'http://localhost:3000',

      // 将本地 /api/xxx 代理到 localhost:3000/xxx
      '/api': {
        target: 'http://localhost:3000/',
        pathRewrite: {
          '/api': ''
        },
        bypass: function(req, res, proxyOptions) {
          // 真实地址写入响应头
          res.header('realAddress', path.join(proxyOptions.target, req.path).replace('/api', ''));
        }
      }
    }
  }
})
