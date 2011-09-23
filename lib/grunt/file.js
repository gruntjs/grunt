var fs = require('fs');
var path = require('path');

var verbose = grequire('log').verbose;

// Read a file, return its contents.
exports.read = function(filepath) {
  var basename = path.basename(filepath);
  var src;
  verbose.write('Reading ' + basename + '...');
  try {
    src = fs.readFileSync(filepath, 'UTF-8');
    verbose.ok();
    return src;
  } catch(e) {
    verbose.error();
    throw new Error('Unable to read "' + basename + '" file (Error code: ' + e.code + ').');
  }
};

// Read a file, parse its contents, return an objects.
exports.readJson = function(filepath, requiredMessage) {
  var basename = path.basename(filepath);
  var src = this.read(filepath);
  var result;
  verbose.write('Parsing ' + basename + '...');
  try {
    result = JSON.parse(src);
    verbose.ok();
    return result;
  } catch(e) {
    verbose.error();
    throw new Error('Unable to parse "' + basename + '" file (' + e.message + ').');
  }
};
