/**
 * 缓存中间件
 */
module.exports = (params = {}) => {
  return function(req, res, next) {
    Object.keys(params).forEach(key => res.header(key, params[key]));

    next();
  }
}
