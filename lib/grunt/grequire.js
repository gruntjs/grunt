var path = require('path');

// Used to require grunt libs. Sweet, sugary goodness. Mmmmn.
module.exports = function(libname) {
  return require(path.join(__dirname, libname));
};
