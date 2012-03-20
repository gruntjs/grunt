/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var grunt = require('../grunt');

// Nodejs libs.
var fs = require('fs');
var path = require('path');

// External libs.
var glob = require('glob-whatev');

// The module to be exported.
var file = module.exports = {};

// Return an array of all file paths that match the given wildcard patterns.
file.expand = function() {
  // Use the first argument if it's an Array, otherwise convert the arguments
  // object to an array and use that.
  var patterns = arguments[0] instanceof Array ? arguments[0] : grunt.utils.toArray(arguments);
  // Generate a should-be-unique number.
  var uid = +new Date();
  // Return a flattened, uniqued array of matching file paths.
  return grunt.utils._(patterns).chain().flatten().map(function(pattern) {
    // If pattern is a template, process it accordingly.
    pattern = grunt.template.process(pattern);
    // Just return the pattern if it's an internal directive.
    if (grunt.task.getDirectiveParts(pattern)) { return pattern; }
    // Otherwise, expand paths.
    return glob.glob(pattern);
  }).flatten().uniq(false, function(filepath) {
    // Only unique file paths, but don't unique <something> directives, in case
    // they are repeated intentionally.
    return grunt.task.getDirectiveParts(filepath) ? ++uid : filepath;
  }).value();
};

// Further filter file.expand.
function expandByType(type) {
  return file.expand.apply(file, arguments).filter(function(filepath) {
    // Just return the filepath if it's an internal directive.
    if (grunt.task.getDirectiveParts(filepath)) { return filepath; }
    try {
      return fs.statSync(filepath)[type]();
    } catch(e) {
      throw grunt.task.taskError(e.message, e);
    }
  });
}

// Return an array of all "directory" file paths that match the given wildcard patterns.
file.expandDirs = expandByType.bind(file, 'isDirectory');

// Return an array of all "file" file paths that match the given wildcard patterns.
file.expandFiles = expandByType.bind(file, 'isFile');

// Return an array of all file paths that match the given wildcard patterns,
// plus any URLs that were passed at the end.
file.expandFileURLs = function() {
  // Use the first argument if it's an Array, otherwise convert the arguments
  // object to an array and use that.
  var patterns = arguments[0] instanceof Array ? arguments[0] : grunt.utils.toArray(arguments);
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
  return file.expandFiles(patterns).map(function(filepath) {
    var abspath = path.resolve(filepath);
    // Convert C:\foo\bar style paths to /C:/foo/bar.
    if (abspath.indexOf('/') !== 0) {
      abspath = ('/' + abspath).replace(/\\/g, '/');
    }
    return 'file://' + abspath;
  }).concat(urls);
};

// Like mkdir -p. Create a directory and any intermediary directories.
file.mkdir = function(dirpath) {
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
file.recurse = function recurse(rootdir, callback, subdir) {
  var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
  fs.readdirSync(abspath).forEach(function(filename) {
    var filepath = path.join(abspath, filename);
    if (fs.statSync(filepath).isDirectory()) {
      recurse(rootdir, callback, path.join(subdir, filename));
    } else {
      callback(path.join(rootdir, subdir, filename), rootdir, subdir, filename);
    }
  });
};

var root = path.resolve('/');

// Is a given file path absolute?
file.isPathAbsolute = function() {
  var filepath = path.join.apply(path, arguments);
  return filepath.indexOf(root) === 0;
};

// Search for a filename in the given directory or all parent directories.
file.findup = function findup(rootdir, filename) {
  var filepath = path.join(rootdir, filename);
  if (path.existsSync(filepath)) {
    return filepath;
  } else if (rootdir === root) {
    return false;
  } else {
    return findup(path.resolve(rootdir, '..'), filename);
  }
};

// Write a file.
file.write = function(filepath, contents) {
  var nowrite = grunt.option('no-write');
  grunt.verbose.write((nowrite ? 'Not actually writing ' : 'Writing ') + filepath + '...');
  try {
    if (!nowrite) {
      // Create path, if necessary.
      file.mkdir(path.dirname(filepath));
      // Actually write file.
      fs.writeFileSync(filepath, contents);
    }
    grunt.verbose.ok();
    return true;
  } catch(e) {
    grunt.verbose.error();
    throw grunt.task.taskError('Unable to write "' + filepath + '" file (Error code: ' + e.code + ').', e);
  }
};

// Read a file, return its contents.
file.read = function(filepath, encoding) {
  var src;
  grunt.verbose.write('Reading ' + filepath + '...');
  try {
    src = fs.readFileSync(String(filepath), encoding ? null : 'utf8');
    grunt.verbose.ok();
    return src;
  } catch(e) {
    grunt.verbose.error();
    throw grunt.task.taskError('Unable to read "' + filepath + '" file (Error code: ' + e.code + ').', e);
  }
};

// Read a file, process its content (optionally), then write the output.
file.copy = function(srcpath, destpath, callback) {
  var src = file.read(srcpath, true);
  if (callback) {
    grunt.verbose.write('Processing source...');
    try {
      src = callback(src.toString('utf8'));
      grunt.verbose.ok();
    } catch(e) {
      grunt.verbose.error();
      throw grunt.task.taskError('Error while processing "' + srcpath + '" file.', e);
    }
  }
  file.write(destpath, src);
};

// Read a file, parse its contents, return an object.
file.readJSON = function(filepath) {
  var src = this.read(String(filepath));
  var result;
  grunt.verbose.write('Parsing ' + filepath + '...');
  try {
    result = JSON.parse(src);
    grunt.verbose.ok();
    return result;
  } catch(e) {
    grunt.verbose.error();
    throw grunt.task.taskError('Unable to parse "' + filepath + '" file (' + e.message + ').', e);
  }
};

// Clear the require cache for all passed filepaths.
file.clearRequireCache = function() {
  // If a non-string argument is passed, it's an array of filepaths, otherwise
  // each filepath is passed individually.
  var filepaths = typeof arguments[0] !== 'string' ? arguments[0] : grunt.utils.toArray(arguments);
  // For each filepath, clear the require cache, if necessary.
  filepaths.forEach(function(filepath) {
    var abspath = path.resolve(filepath);
    if (require.cache[abspath]) {
      grunt.verbose.write('Clearing require cache for "' + filepath + '" file...').ok();
      delete require.cache[abspath];
    }
  });
};

// Access files in the user's ".grunt" folder.
file.userDir = function() {
  var filepath = path.join.apply(path, arguments);
  var win32 = process.platform === 'win32';
  var homepath = process.env[win32 ? 'USERPROFILE' : 'HOME'];
  return path.resolve(homepath, '.grunt', filepath);
};

// Get an Npm grunt plugin tasks path or null.
file.npmTaskDir = function(name) {
  var filepath;
  try {
    filepath = require.resolve(name);
    filepath = path.join(path.dirname(filepath), 'tasks');
    if (path.existsSync(filepath)) {
      return filepath;
    }
  } catch (e) {}
  return null;
};

// Get a list of task paths (or task-specific extraspaths).
file.taskDirs = function() {
  var args;
  var taskpaths = [];
  // Path to user's "tasks" files.
  taskpaths.push(file.userDir('tasks'));
  // Paths to user-specified --tasks dirs.
  var optiontasks = grunt.option('tasks') ? grunt.option('tasks').slice() : [];
  taskpaths = taskpaths.concat(optiontasks.map(function(relpath) {
    var npmTaskDir = file.npmTaskDir(relpath);
    if (npmTaskDir) {
      // Npm module found, use its path.
      return npmTaskDir;
    } else if (path.existsSync(relpath)) {
      // File path exists, load tasks from there.
      return path.resolve(relpath);
    }
  }).filter(Boolean));
  // Path to built-in task files.
  taskpaths.push(path.resolve(__dirname, '../../tasks'));
  // If arguments were specified, join them to pathnames.
  if (arguments.length > 0) {
    args = grunt.utils.toArray(arguments);
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
file.taskFiles = function() {
  var filepath = path.join.apply(path, arguments);
  var filepaths = {};
  // When any returned array item is used in a string context, return the
  // absolute path.
  var toString = function() { return this.abs; };
  // Iterate over all taskpaths in reverse.
  file.taskDirs().reverse().map(function(dirpath) {
    var abspath = path.join(dirpath, filepath);
    // Expand the path in case a wildcard was passed.
    file.expandFiles(abspath).forEach(function(abspath) {
      var relpath = abspath.slice(dirpath.length + 1);
      // This object overrides any previously set object for this relpath.
      filepaths[relpath] = {
        abs: abspath,
        rel: relpath,
        base: abspath.slice(0, dirpath.length),
        toString: toString
      };
    });
  });
  // Return an array of objects.
  return Object.keys(filepaths).map(function(relpath) {
    return filepaths[relpath];
  });
};

// Find the first task file matching a given path.
file.taskFile = function() {
  return file.taskFiles.apply(file, arguments)[0];
};

// Read JSON defaults from task files (if they exist), merging them into one.
// data object.
var taskFileDefaults = {};
file.taskFileDefaults = function() {
  var filepath = path.join.apply(path, arguments);
  var result = taskFileDefaults[filepath];
  var filepaths;
  if (!result) {
    result = taskFileDefaults[filepath] = {};
    // Find all matching taskfiles.
    filepaths = file.taskFiles(filepath);
    // Load defaults data.
    if (filepaths.length) {
      grunt.verbose.subhead('Loading data from ' + filepath);
      // Since extras path order goes from most-specific to least-specific, only
      // add-in properties that don't already exist.
      filepaths.forEach(function(filepath) {
        grunt.utils._.defaults(result, file.readJSON(filepath));
      });
    }
  }
  return result;
};
