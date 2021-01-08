const path = require('path');
const fs = require('fs');

module.exports = function (app, router) {
  const dirs = fs.readdirSync(path.resolve(__dirname)) || [];

  dirs.forEach(dirOrFile => {
    const dirPath = path.resolve(__dirname, dirOrFile); // 文件夹路径
    const stat = fs.statSync(dirPath); // 读取的文件信息

    // 只处理文件里面的 router 文件，其他文件不处理
    if (stat.isDirectory()) {
      const routerFiles = fs.readdirSync(dirPath) || [];

      routerFiles.forEach(file => {
        // 去掉后缀的文件名
        const basename = path.basename(file, '.js');

        app.use(`/${dirOrFile}/${basename}`, require(`./${dirOrFile}/${file}`)(router));
      })
    }
  });
};
