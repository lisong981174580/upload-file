const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  /** 
   * @method 查询上传的图片
   * @return {list: string[]} 图片列表
   */
  app.get('/select/:type', (req, res) => {
    let imgs = [];

    if (req.params.type === 'base64') {
      imgs = dirEach(path.resolve(__dirname, '../../public'));
    } else {
      imgs = fs.readdirSync(path.resolve(__dirname, '../../public'))
        .map(img => `http://localhost:3000/static/${img}`);
    }

    res.json({
      list: imgs,
    })
  })
}

/** 
 * @method 遍历目录下的文件并逐个转换为base64
 */
function dirEach(dir) {
  const res = [];
  let pa = [];

  try {
    // 读取文件夹下面的文件或文件夹列表
    pa = fs.readdirSync(dir);
  } catch(error) {
    return [];
  }

  for (let item of pa) {
    let itemPath = path.resolve(dir + '/' + item);

    // 读取的文件信息
    let stat = fs.statSync(itemPath);

    // 是否是文件目录，判断是否为文件可以用 stats.isFile()
    if (stat.isDirectory()) {
      res.concat(dirEach(itemPath));
    } else {
      if (stat.size < 5 * 1024) {
        // 图片转为 base 64
        let buffer = Buffer.from(fs.readFileSync(itemPath));
        buffer = buffer.toString('base64');

        res.push(`data: image/${getImageType(itemPath)};base64,${buffer}`)
      } else {
        res.push(`http://localhost:3000/static/${item}`)
      }
    }
  }

  return res;
}

/** 
 * @method 获取文件类型
 */
function getImageType(str){
  var reg = /\.(png|jpg|gif|jpeg|webp)$/;
  return str.match(reg)[1];
}

