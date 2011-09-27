var path = require('path');

// Used to require grunt libs. Sweet, sugary goodness. Mmmmn.
module.exports = function(libname) {
  // Load grunt lib.
  var fn = require(path.join(__dirname, libname));
  // If extra args were passed, invoke fn. Otherwise, return fn.
  return arguments.length > 1 ? fn.apply([].slice.call(arguments, 1)) : fn;
};
