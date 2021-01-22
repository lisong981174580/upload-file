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

// IgnorePlugin 避免引入无用模块演示
import moment from 'moment';
import 'moment/locale/zh-cn'; // 手动引入中文语言包

moment.locale('zh-cn'); // 设置语言为中文
console.log('locale', moment.locale());
console.log('date', moment().format('ll')); // 2020年xx月xx日


// // 增加，开启热更新之后的代码逻辑
if (module.hot) {
    module.hot.accept(['./lib/sum'], () => {
        const sumRes = sum(10, 30)
        console.log('sumRes in hot', sumRes)
    })
}