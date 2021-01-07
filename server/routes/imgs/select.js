const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  /** 
   * @method 查询上传的图片
   * @return {list: string[]} 图片列表
   */
  app.get('/select/:type', async (req, res) => {
    let imgs = [];

    if (req.params.type === 'base64') {
      imgs = await dirEach(path.resolve(__dirname, '../../public'));
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
async function dirEach(dir) {
  const res = [];
  let pa = [];

  try {
    pa = fs.readdirSync(dir);
  } catch(error) {
    return [];
  }

  for (let item of pa) {
    let itemPath = path.resolve(dir + '/' + item);
    let stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      res.concat(await dirEach(itemPath));
    } else {
      const size = await getFileSize(itemPath);

      if (size < 5 * 1024) {
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

/** 
 * @method 获取文件大小
 */
function getFileSize(str) {
  return new Promise((resolve, reject) => {
    try {
      fs.stat(str, (err, stats) => {
        if (stats && stats.size !== undefined) {
          resolve(stats.size);
        } else {
          reject();
        }
      })
    } catch (error) {
      reject();
    }
  })
}
