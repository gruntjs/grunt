/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var fs = require('fs');
var path = require('path');
var glob = require('glob-whatev');

// Return an array of all file paths that match the given wildcard patterns.
exports.expand = function() {
  // Use the first argument if it's an Array, otherwise convert the arguments
  // object to an array and use that.
  var patterns = arguments[0] instanceof Array ? arguments[0] : util.toArray(arguments);
  // Generate a should-be-unique number.
  var uid = +new Date();
  // Return a flattened, uniqued array of matching file paths.
  return underscore(patterns).chain().flatten().map(function(pattern) {
    // Just return the pattern if it's an internal directive.
    if (task.getDirectiveParts(pattern)) { return pattern; }
    // Otherwise, expand paths.
    return glob.glob(pattern, glob.GLOB_DEFAULT | glob.GLOB_NOCHECK);
  }).flatten().uniq(false, function(filepath) {
    // Only unique file paths, but don't unique <something> directives, in case
    // they are repeated intentionally.
    return task.getDirectiveParts(filepath) ? ++uid : filepath;
  }).filter(function(filepath) {
    // Just return the filepath if it's an internal directive.
    if (task.getDirectiveParts(filepath)) { return filepath; }
    try {
      return fs.statSync(filepath).mode !== 16877;
    } catch(e) {
      throw task.taskError(e.message, e);
    }
  }).value();
};

// Like mkdir -p. Create a directory and any intermediary directories.
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

// Recurse into a directory, executing callback for each file.
exports.recurse = function(rootdir, callback, subdir) {
  var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
  fs.readdirSync(abspath).forEach(function(filename) {
    var filepath = path.join(abspath, filename);
    if (fs.statSync(filepath).mode === 16877) {
      exports.recurse(rootdir, callback, path.join(subdir, filename));
    } else {
      callback(path.join(rootdir, subdir, filename), rootdir, subdir, filename);
    }
  });
};

// Search for a filename in the given directory or all parent directories.
exports.findup = function(rootdir, filename) {
  var filepath = path.join(rootdir, filename);
  if (path.existsSync(filepath)) {
    return filepath;
  } else if (rootdir === '/') {
    return false;
  } else {
    return exports.findup(path.resolve(rootdir, '..'), filename);
  }
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
    throw task.taskError('Unable to write "' + filepath + '" file (Error code: ' + e.code + ').', e);
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
    throw task.taskError('Unable to read "' + filepath + '" file (Error code: ' + e.code + ').', e);
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
    throw task.taskError('Unable to parse "' + filepath + '" file (' + e.message + ').', e);
  }
};

// Clear the require cache for all passed filepaths.
exports.clearRequireCache = function() {
  // If a non-string argument is passed, it's an array of filepaths, otherwise
  // each filepath is passed individually.
  var filepaths = typeof arguments[0] !== 'string' ? arguments[0] : util.toArray(arguments);
  // For each filepath, clear the require cache, if necessary.
  filepaths.forEach(function(filepath) {
    var abspath = path.resolve(filepath);
    if (require.cache[abspath]) {
      verbose.write('Clearing require cache for "' + filepath + '" file...').ok();
      delete require.cache[abspath];
    }
  });
};
