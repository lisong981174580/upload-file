const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 生产环境 css 拆分

// 压缩 css
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack'); // 多进程打包
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const webpackCommonConf = require('./webpack.common.js');
const { merge } = require("webpack-merge");
const { distPath, srcPath } = require('./paths');

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
      // js
      {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        include: srcPath,
        // exclude: /node_modules/
      },
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

    // 忽略 moment 下的 /locale 目录
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),

    // happyPack 开启多进程打包
    new HappyPack({
        // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
        id: 'babel',
        
        // 如何处理 .js 文件，用法和 Loader 配置中一样
        loaders: ['babel-loader?cacheDirectory']
    }),

    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      //（还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
      uglifyJS: {
          output: {
              beautify: false, // 最紧凑的输出
              comments: false, // 删除所有的注释
          },
          compress: {
              // 删除所有的 `console` 语句，可以兼容ie浏览器
              drop_console: true,
              // 内嵌定义了但是只用到一次的变量
              collapse_vars: true,
              // 提取出出现多次但是没有定义成变量去引用的静态值
              reduce_vars: true,
          }
      }
    })
  ],

  optimization: {
    // 压缩 css
    minimizer: [
      new TerserJSPlugin({}), 
      new OptimizeCSSAssetsPlugin({})
    ],

    // 分割代码块
    splitChunks: {
      chunks: 'all',

      /**
       *  initial: 入口 chunk，对于异步导入的文件不处理
       *  async: 异步 chunk，只对异步导入的文件处理
       *  all: 全部 chunk
       */

      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: 'vendor', // chunk 名称
          priority: 1, // 权限更高，优先抽离，重要！！！,因为第三方模块可能和自己定义的模块有冲突
          test: /node_modules/,
          minSize: 0,  // 大小限制：最小是多大才会拆分，默认是 30000
          minChunks: 1  // 最少复用次数：最少复用几次才会拆分
        },

        // 公共的模块
        common: {
          name: 'common', // chunk 名称
          priority: 0, // 优先级
          minSize: 0,  // 公共模块的大小限制
          minChunks: 2  // 公共模块最少复用过几次
        }
      }
    }
  }
})
