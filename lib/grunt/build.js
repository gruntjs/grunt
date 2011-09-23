var path = require('path');

var file = grequire('file');
var fail = grequire('fail');
var log = grequire('log');

// Get passed json file or default to grunt.json in the current directory.
var buildfile = __options.build || path.join(process.cwd(), 'grunt.json');
var basename = path.basename(buildfile);

// Give new users a little --help.
if (!path.existsSync(buildfile)) {
  fail.fatal('Unable to find "' + basename + '" build file. Use --help for help.');
}

try {
  // Export JSON data.
  module.exports = file.readJson(buildfile);
} catch(e) {
  // Oops.
  fail.fatal(e.message);
}
