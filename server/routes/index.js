const path = require('path');
const fs = require('fs');

module.exports = function (app) {
  const routes = fs.readdirSync(path.resolve(__dirname, 'imgs')) || [];

  routes.forEach(router => require(path.resolve(__dirname, `imgs/${router}`))(app));
};
