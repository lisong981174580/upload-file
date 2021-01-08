// 参考文档：https://javascript.ruanyifeng.com/nodejs/express.html
const express = require('express');
const app = express();

// 服务端解决跨域中间件，可针对单个接口跨域，也可以设置全局都支持跨域
const allowCors = require('./middleWares/allowCors');

// 现在就可以访问 http://localhost: 3000/static，它会在浏览器中打开当前目录的 public 子目录（严格来说，是打开 public 目录的 index.html 文件）。如果public目录之中有一个图片文件 my_image.png，那么可以用 http://localhost:8080/static/my_image.png 访问该文件
app.use('/static', allowCors, express.static(__dirname + '/public'));

// 多级路由
const router = express.Router();
require('./routes')(app, router);

app.listen(3000, () => {
  console.log('启动成功，监听 3000端口')
})

