const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

module.exports = function (app) {
  /** 
   * @method 上传文件接口
   * @param {File} file
   * @param {any} param
   */
  app.post('/upload', multipartMiddleware, async (req, res) => {
    if (
      !req.files 
        || !req.files.file 
        || !req.files.file.path 
        || !req.files.file.originalFilename
    ) {
      return res.json({
        msg: '入参缺失'
      })
    }

    const targetDir = path.resolve(__dirname, `../../public`);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    shelljs.mv(
      req.files.file.path, 
      path.join(targetDir, `/${req.files.file.originalFilename}`)
    );

    res.json(req.body);
  })
};

