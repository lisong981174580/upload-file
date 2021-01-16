// 设置缓存中间件
const setCache = require('../../middleWares/setCache');

module.exports = function(router) {
  /** 
   * @method 查询上传的图片
   * @return {list: string[]} 图片列表
   */
  router.get('/', setCache({
    // 服务端控制不使用缓存
    'Cache-Control': 'no-store',
  }), (req, res) => {
    res.json({
      name: 'allen',
      arg: '26',
    })
  })

  return router;
}