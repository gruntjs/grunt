var fs = require('fs');
var path = require('path');
var glob = require('glob');

// Return an array of all file paths that match the given wildcard patterns.
exports.expand = function() {
  // Use the first argument if it's an Array, otherwise convert the arguments
  // object to an array and use that.
  var patterns = arguments[0] instanceof Array ? arguments[0] : [].slice.call(arguments);
  // Generate a should-be-unique number.
  var uid = +new Date();
  // Return a uniqued array of matching file paths.
  return _(patterns).chain().map(function(pattern) {
    // Just return the pattern if it's an internal directive.
    if (config.getDirective(pattern)) { return pattern; }
    // Otherwise, expand paths.
    return glob.globSync(pattern, glob.GLOB_DEFAULT | glob.GLOB_NOCHECK);
  }).flatten().uniq(false, function(filepath) {
    // Only unique file paths, but don't unique <something> directives, in case
    // they are repeated intentionally.
    return config.getDirective(filepath) ? ++uid : filepath;
  }).filter(function(filepath) {
    // Just return the filepath if it's an internal directive.
    if (config.getDirective(filepath)) { return filepath; }
    try {
      return fs.statSync(filepath).mode !== 16877;
    } catch(e) {
      throw {name: 'TaskError', message: e.message};
    }
  }).value();
};

// Like mkdir -p. Create a deirectory and any intermediary directories.
exports.mkdir = function(dirpath) {
  var parts = [];
  dirpath.split('/').forEach(function(part) {
    parts.push(part);
    var subpath = parts.join('/');
    if (part && !path.existsSync(subpath)) {
      fs.mkdirSync(subpath, '0755');
    }
  });
};

// Write a file.
exports.write = function(filepath, contents) {
  var nowrite = option('no-write');
  verbose.write((nowrite ? 'Not actually writing ' : 'Writing ') + filepath + '...');
  try {
    if (!nowrite) {
      // Create path, if necessary.
      exports.mkdir(path.dirname(filepath));
      // Actually write file.
      fs.writeFileSync(filepath, contents, 'UTF-8');
    }
    verbose.ok();
    return true;
  } catch(e) {
    verbose.error();
    throw {name: 'TaskError', message: 'Unable to write "' + filepath + '" file (Error code: ' + e.code + ').'};
  }
};

// Read a file, return its contents.
exports.read = function(filepath) {
  var src;
  verbose.write('Reading ' + filepath + '...');
  try {
    src = fs.readFileSync(filepath, 'UTF-8');
    verbose.ok();
    return src;
  } catch(e) {
    verbose.error();
    throw {name: 'TaskError', message: 'Unable to read "' + filepath + '" file (Error code: ' + e.code + ').'};
  }
};

// Read a file, parse its contents, return an object.
exports.readJson = function(filepath) {
  var src = this.read(filepath);
  var result;
  verbose.write('Parsing ' + filepath + '...');
  try {
    result = JSON.parse(src);
    verbose.ok();
    return result;
  } catch(e) {
    verbose.error();
    throw {name: 'TaskError', message: 'Unable to parse "' + filepath + '" file (' + e.message + ').'};
  }
};
