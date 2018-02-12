var grunt = require('../grunt');

function deprecate(obj, property, message) {
  if (Array.isArray(obj)) {
    obj.forEach(function(item) {
      deprecate(item.obj, item.property, item.message);
    });
    return;
  }
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
    set: function(val) {
      warn();
      orig = val;
    },
    get: function() {
      warn();
      return orig;
    }
  });
}
module.exports = deprecate;

deprecate([
  {
    obj: grunt.util,
    property: '_',
    message: 'grunt.util._ has been deprecated. Please install and require ' +
      '"lodash" directly. https://www.npmjs.com/package/lodash'
  },
  {
    obj: grunt.util,
    property: 'async',
    message: 'grunt.util.async has been deprecated. Please install and require ' +
      '"async" directly. https://www.npmjs.com/package/async'
  },
  {
    obj: grunt.util,
    property: 'namespace',
    message: 'grunt.util.namespace has been deprecated. Please install and ' +
      'require "getobject" directly. https://www.npmjs.com/package/getobject'
  },
  {
    obj: grunt.util,
    property: 'hooker',
    message: 'grunt.util.hooker has been deprecated. Please install and require ' +
      '"hooker" directly. https://www.npmjs.com/package/hooker'
  },
  {
    obj: grunt.util,
    property: 'exit',
    message: 'grunt.util.exit has been deprecated. Please install and require ' +
      '"exit" directly. https://www.npmjs.com/package/exit'
  },
  {
    obj: grunt.util,
    property: 'toArray',
    message: 'grunt.util.toArray has been deprecated. Please install and ' +
      'require "lodash.toarray" directly. https://www.npmjs.com/package/lodash.toarray'
  },
  {
    obj: grunt.util,
    property: 'repeat',
    message: 'grunt.util.repeat has been deprecated. Please use ' +
      '`new Array(num + 1).join(str || \' \')` or another library.'
  },
  {
    obj: grunt.file,
    property: 'glob',
    message: 'grunt.file.glob has been deprecated. Please install and require ' +
      '"glob" directly. https://www.npmjs.com/package/glob'
  },
  {
    obj: grunt.file,
    property: 'minimatch',
    message: 'grunt.file.minimatch has been deprecated. Please install and ' +
      'require "minimatch" directly. https://www.npmjs.com/package/minimatch'
  },
  {
    obj: grunt.file,
    property: 'findup',
    message: 'grunt.file.findup has been deprecated. Please install and require ' +
      '"findup-sync" directly. https://www.npmjs.com/package/findup-sync'
  },
  {
    obj: grunt.file,
    property: 'readYAML',
    message: 'grunt.file.readYAML has been deprecated. Please install and ' +
      'require "js-yaml" directly. https://www.npmjs.com/package/js-yaml'
  },
  {
    obj: grunt.file,
    property: 'readJSON',
    message: 'grunt.file.readJSON has been deprecated. Please use require("file.json") directly.'
  },
  {
    obj: grunt,
    property: 'event',
    message: 'grunt.event has been deprecated. Please install and require ' +
      '"eventemitter2" directly. https://www.npmjs.com/package/eventemitter2'
  },
]);
