var grunt = require('../grunt');

function deprecate(obj, property, message) {
  var logged = false;
  function warn() {
    var hideDeprecation = grunt.option('hide-deprecations');
    if (!hideDeprecation && !logged) {
      if (grunt.option('stack')) {
        grunt.log.warn(Error(message).stack);
      } else {
        grunt.log.warn(message);
      }
      logged = true;
    }
  }
  var orig = obj[property];
  Object.defineProperty(obj, property, {
    enumerable: true,
    configurable: true,
    set: function() {
      warn();
    },
    get: function() {
      warn();
      return orig;
    }
  });
}
module.exports = deprecate;
