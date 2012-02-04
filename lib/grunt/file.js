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

// Return an array of all file paths that match the given wildcard patterns,
// plus any URLs that were passed at the end.
exports.expandToUrls = function() {
  // Use the first argument if it's an Array, otherwise convert the arguments
  // object to an array and use that.
  var patterns = arguments[0] instanceof Array ? arguments[0] : util.toArray(arguments);
  var urls = [];
  // Filter all URLs out of patterns list and store them in a separate array.
  patterns = patterns.filter(function(pattern) {
    if (/^(?:file|https?):\/\//i.test(pattern)) {
      // Push onto urls array.
      urls.push(pattern);
      // Remove from patterns array.
      return false;
    }
    // Otherwise, keep pattern.
    return true;
  });
  // Return expanded filepaths with urls at end.
  return exports.expand(patterns).map(function(filepath) {
    return 'file://' + path.resolve(filepath);
  }).concat(urls);
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
var root = path.resolve('/');
exports.findup = function(rootdir, filename) {
  var filepath = path.join(rootdir, filename);
  if (path.existsSync(filepath)) {
    return filepath;
  } else if (rootdir === root) {
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
      fs.writeFileSync(filepath, contents);
    }
    verbose.ok();
    return true;
  } catch(e) {
    verbose.error();
    throw task.taskError('Unable to write "' + filepath + '" file (Error code: ' + e.code + ').', e);
  }
};

// Read a file, return its contents.
exports.read = function(filepath, encoding) {
  var src;
  verbose.write('Reading ' + filepath + '...');
  try {
    src = fs.readFileSync(filepath, encoding ? null : 'utf8');
    verbose.ok();
    return src;
  } catch(e) {
    verbose.error();
    throw task.taskError('Unable to read "' + filepath + '" file (Error code: ' + e.code + ').', e);
  }
};

// Read a file, process its content (optionally), then write the output.
exports.copy = function(srcpath, destpath, callback) {
  var src = exports.read(srcpath, true);
  if (callback) {
    verbose.write('Processing source...');
    try {
      src = callback(src.toString('utf8'));
      verbose.ok();
    } catch(e) {
      verbose.error();
      throw task.taskError('Error while processing "' + srcpath + '" file.', e);
    }
  }
  exports.write(destpath, src);
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

// Access files in the user's ".grunt" folder.
exports.userpath = function(filepath) {
  var win32 = process.platform === 'win32';
  var homepath = process.env[win32 ? 'USERPROFILE' : 'HOME'];
  return path.resolve(homepath, '.grunt', filepath);
};

// Get a list of task paths (or task-specific extraspaths).
exports.taskpaths = function() {
  var args;
  var taskpaths = [];
  // Path to user's "tasks" files.
  taskpaths.push(exports.userpath('tasks'));
  // Paths to user-specified --tasks dirs.
  var optiontasks = option('tasks') ? option('tasks').slice() : [];
  taskpaths = taskpaths.concat(optiontasks.map(function(relpath) {
    return path.resolve(relpath);
  }));
  // Path to built-in task files.
  taskpaths.push(path.resolve(__dirname, '../../tasks'));
  // If arguments were specified, join them to pathnames.
  if (arguments.length > 0) {
    args = util.toArray(arguments);
    taskpaths = taskpaths.map(function(dirpath) {
      return path.join.apply(path, [dirpath].concat(args));
    });
  }
  // Return only directories that actually exist!
  return taskpaths.filter(function(dirpath) {
    return path.existsSync(dirpath) && fs.statSync(dirpath).isDirectory();
  });
};

// Find all task files matching a given path.
exports.taskfiles = function() {
  var filepath = path.join.apply(path, arguments);
  var basename = path.basename(filepath);
  return exports.taskpaths(path.dirname(filepath)).map(function(dirpath) {
    return path.join(dirpath, basename);
  }).filter(function(filepath) {
    return path.existsSync(filepath);
  });
};

// Find the first task file matching a given path.
exports.taskfile = function() {
  return exports.taskfiles.apply(exports, arguments)[0];
};
