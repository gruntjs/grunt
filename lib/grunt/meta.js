var path = require('path');

var file = grequire('file');
var fail = grequire('fail');

// Get passed json file or default to grunt.json in the current directory.
var jsonfile = __options.json || path.join(process.cwd(), 'grunt.json');

try {
  module.exports = file.readJson(jsonfile);
} catch(e) {
  fail(e.message);
}
