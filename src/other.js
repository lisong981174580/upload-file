import './other.less';

import { sum } from './lib/sum';
sum(1, 2);

// 第三方模块希望单独打包，公共模块希望单独打包，因为这些文件很少有变动，hash 值不容易变，但是不抽离的话，
// 只要文件有变动就都需要重新打包一遍耗费性能，比如三方库太大的时候

// 引入动态数据 - 懒加载
setTimeout(() => {
  // 回顾 vue React 异步加载组件
  // 定义一个 chunk
  import('./dynamic-data').then(res => {
    console.log(res.default.message) // 注意这里的 default
  })
}, 5000)