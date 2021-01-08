const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');

// 处理文件的中间件，前端用 multipart/form-data
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

module.exports = function (router) {
  /** 
   * @method 上传文件接口
   * @param {File} file
   * @param {any} param
   */
  router.post('/', multipartMiddleware, async (req, res) => {
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

    // 使用绝对路径
    const targetDir = path.resolve(__dirname, `../../public`);
    
    // 如果路径存在，则返回 true，否则返回 false
    if (!fs.existsSync(targetDir)) {
      // 创建文件夹
      fs.mkdirSync(targetDir);
    }

    shelljs.mv(
      req.files.file.path, 
      
      // 规范化生成路径
      path.join(targetDir, `/${req.files.file.originalFilename}`)
    );

    res.json(req.body);
  })

  return router;
};

