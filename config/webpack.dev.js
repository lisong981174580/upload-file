const webpack = require('webpack');
const webpackCommonConf = require('./webpack.common.js');
const { merge } = require("webpack-merge");
const { distPath, srcPath } = require('./paths');
const path = require('path');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = merge(webpackCommonConf, {
  mode: 'development',
  // 多入口写法
  entry: {
    index: [
      // 热更新配置，只需在 index 页面里面配置，other 页面同样会生效
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack/hot/dev-server',
      path.join(srcPath, 'index'),
    ],

    other: path.join(srcPath, 'other'),
  },
  module: {
    // 直接引入图片
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          // 开启缓存
          options: {
            cacheDirectory: true
          },
        }],
        include: srcPath,
        // exclude: /node_modules/
        // 排除范围，include 和 exclude 两者选择一个即可
      },
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
    }),

    // 热更新插件
    new HotModuleReplacementPlugin(),
  ],
  devServer: {
    port: 8080,
    progress: true,  // 显示打包的进度条
    contentBase: distPath,  // 根目录
    open: true,  // 自动打开浏览器，并且修改后会自动刷新
    compress: true,  // 启动 gzip 压缩
    hot: true,

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
