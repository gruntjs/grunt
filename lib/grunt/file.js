var fs = require('fs');
var path = require('path');

// Write a file.
exports.write = function(filepath, contents) {
  var basename = path.basename(filepath);
  var nowrite = option('no-write');
  verbose.write((nowrite ? 'Not actually writing ' : 'Writing ') + basename + '...');
  try {
    nowrite || fs.writeFileSync(filepath, contents, 'UTF-8');
    verbose.ok();
    return true;
  } catch(e) {
    verbose.error();
    throw new Error('Unable to write "' + basename + '" file (Error code: ' + e.code + ').');
  }
};

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

// Read a file, parse its contents, return an object.
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
