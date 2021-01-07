const shelljs = require('shelljs');
const path = require('path');

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

module.exports = function (app) {
  /** 
   * @method 上传文件接口
   * @param {File} file
   * @param {any} param
   */
  app.post('/upload', multipartMiddleware, (req, res) => {
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

    shelljs.mv(
      req.files.file.path, 
      path.resolve(__dirname, `../../public/${req.files.file.originalFilename}`)
    );

    res.json(req.body);
  })
};
