var fs = require('fs');

module.exports = function(filePath){
  try {
    fs.accessSync(routerPath);
  }
  catch (e) {
    return false;
  }
  return true;
};
