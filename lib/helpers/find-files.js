var path      = require('path');
var walkSync  = require('walk-sync');

module.exports = function(rootPath, ext, exclude) {
  var resolvedFiles = [],
      result = [];

  if (path.extname(rootPath).length > 0) {
    resolvedFiles.push(rootPath);
  } else {
    resolvedFiles = walkSync(rootPath).filter(function(file) {
      return path.extname(file) === ext;
    }).map(function(file) {
      return path.join(rootPath, file);
    });
  }
  if (exclude === undefined) { exclude = [] }
  for (i = 0; i < resolvedFiles.length; i++) { 
    elt = resolvedFiles[i]; 
    if (exclude.indexOf(elt) === -1) { result.push(elt) }
  }
  return result;
};
