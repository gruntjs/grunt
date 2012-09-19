/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

var grunt = require('../grunt');

// Nodejs libs.
var fs = require('fs');
var path = require('path');
// In Nodejs 0.8.0, existsSync moved from path -> fs.
var existsSync = fs.existsSync || path.existsSync;

// The module to be exported.
var file = module.exports = {};

// External libs.
file.glob = require('glob-whatev');
file.findup = require('../util/findup');
var YAML = require('js-yaml');
var rimraf = require('rimraf');
var iconv = require('iconv-lite');

// Windows?
var win32 = process.platform === 'win32';

// Normalize \\ paths to / paths.
var unixifyPath = function(filepath) {
  if (win32) {
    return filepath.replace(/\\/g, '/');
  } else {
    return filepath;
  }
};

// Change the current base path (ie, CWD) to the specified path.
file.setBase = function() {
  var dirpath = path.join.apply(path, arguments);
  process.chdir(dirpath);
};

// Process specified wildcard glob patterns or filenames against a
// callback, excluding and uniquing files in the result set.
var processPatterns = function(patterns, fn) {
  // Filepaths to return.
  var result = [];
  // Flattened, Underscore.js-chainable set of patterns.
  grunt.util._(patterns).chain().flatten().each(function(pattern) {
    // If the first character is ! it should be omitted
    var exclusion = pattern.indexOf('!') === 0;
    // If the pattern is an exclusion, remove the !
    if (exclusion) { pattern = pattern.slice(1); }
    // Find all matching files for this pattern.
    var matches = fn(pattern);
    if (exclusion) {
      // If an exclusion, remove matching files.
      result = grunt.util._.difference(result, matches);
    } else {
      // Otherwise add matching files.
      result = grunt.util._.union(result, matches);
    }
  });
  return result;
};

// Match a filepath or filepaths against one or more wildcard patterns. Returns
// all matching filepaths.
file.match = function(options, patterns, filepaths) {
  if (grunt.util.kindOf(options) !== 'object') {
    filepaths = patterns;
    patterns = options;
    options = {};
  }
  // Return empty set if either patterns or filepaths was omitted.
  if (patterns == null || filepaths == null) { return []; }
  // Normalize patterns and filepaths to arrays.
  if (!Array.isArray(patterns)) { patterns = [patterns]; }
  if (!Array.isArray(filepaths)) { filepaths = [filepaths]; }
  // Return empty set if there are no patterns or filepaths.
  if (patterns.length === 0 || filepaths.length === 0) { return []; }
  // Return all matching filepaths.
  return processPatterns(patterns, function(pattern) {
    return filepaths.filter(file.glob.minimatch.filter(pattern, options));
  });
};

// Match a filepath or filepaths against one or more wildcard patterns. Returns
// true if any of the patterns match.
file.isMatch = function() {
  return file.match.apply(file, arguments).length > 0;
};

// Return an array of all file paths that match the given wildcard patterns.
file.expand = function() {
  var args = grunt.util.toArray(arguments);
  // If the first argument is an options object, save those options to pass
  // into the file.glob.glob method for minimatch to use.
  var options = grunt.util.kindOf(args[0]) === 'object' ? args.shift() : {};
  // Use the first argument if it's an Array, otherwise convert the arguments
  // object to an array and use that.
  var patterns = Array.isArray(args[0]) ? args[0] : args;
  // Return empty set if there are no patterns or filepaths.
  if (patterns.length === 0) { return []; }
  // Return all matching filepaths.
  return processPatterns(patterns, function(pattern) {
    // Find all matching files for this pattern.
    return file.glob.glob(pattern, options);
  });
};

// Further filter file.expand.
var expandByType = function(type) {
  var args = grunt.util.toArray(arguments).slice(1);
  // If the first argument is an options object, grab it.
  var options = grunt.util.kindOf(args[0]) === 'object' ? args[0] : {};
  // Match, then filter filepaths.
  return file.expand.apply(file, args).filter(function(filepath) {
    try {
      // If the file is of the right type and exists, this should work.
      return fs.statSync(path.join(options.cwd, filepath))[type]();
    } catch(e) {
      // Otherwise, it's probably not the right type.
      return false;
    }
  });
};

// A few type-specific file expansion methods.
file.expandDirs = expandByType.bind(file, 'isDirectory');
file.expandFiles = expandByType.bind(file, 'isFile');

// Return an array of all file paths that match the given wildcard patterns,
// plus any URLs that were passed at the end.
file.expandFileURLs = function() {
  // Use the first argument if it's an Array, otherwise convert the arguments
  // object to an array and use that.
  var patterns = Array.isArray(arguments[0]) ? arguments[0] : grunt.util.toArray(arguments);
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
      abspath = unixifyPath('/' + abspath);
    }
    return 'file://' + abspath;
  }).concat(urls);
};

// Like mkdir -p. Create a directory and any intermediary directories.
file.mkdir = function(dirpath, mode) {
  if (grunt.option('no-write')) { return; }
  // Set directory mode in a strict-mode-friendly way.
  if (mode == null) {
    mode = parseInt('0777', 8) & (~process.umask());
  }
  dirpath.split(/[\/\\]/).reduce(function(parts, part) {
    parts += part + '/';
    var subpath = path.resolve(parts);
    if (!file.exists(subpath)) {
      try {
        fs.mkdirSync(subpath, mode);
      } catch(e) {
        throw grunt.util.error('Unable to create directory "' + subpath + '" (Error code: ' + e.code + ').', e);
      }
    }
    return parts;
  }, '');
};

// Recurse into a directory, executing callback for each file.
file.recurse = function recurse(rootdir, callback, subdir) {
  var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
  fs.readdirSync(abspath).forEach(function(filename) {
    var filepath = path.join(abspath, filename);
    if (fs.statSync(filepath).isDirectory()) {
      recurse(rootdir, callback, unixifyPath(path.join(subdir, filename)));
    } else {
      callback(unixifyPath(filepath), rootdir, subdir, filename);
    }
  });
};

// Is a given file path absolute?
file.isPathAbsolute = function() {
  var filepath = path.join.apply(path, arguments);
  return path.resolve(filepath) === filepath;
};

// Get a real, relative path. Returns false on error (like ENOENT).
var getRealRelativePath = function(filepath) {
  var realpath, relative;
  try {
    realpath = fs.realpathSync(filepath);
    relative = path.relative(realpath, process.cwd());
    return relative;
  } catch (e) {
    return false;
  }
};

// Test to see if a filepath is the CWD.
file.isPathCwd = function() {
  var filepath = path.join.apply(path, arguments);
  return getRealRelativePath(filepath) === '';
};

// Test to see if a filepath is contained within the CWD.
file.isPathInCwd = function() {
  var filepath = path.join.apply(path, arguments);
  var relative = getRealRelativePath(filepath);
  return relative !== false && relative !== '' && !/\w+/.test(relative);
};

// The default file encoding to use.
file.defaultEncoding = 'utf8';

// Read a file, return its contents.
file.read = function(filepath, options) {
  if (!options) { options = {}; }
  var contents;
  grunt.verbose.write('Reading ' + filepath + '...');
  try {
    contents = fs.readFileSync(String(filepath));
    // If encoding is not explicitly null, convert from encoded buffer to a
    // string. If no encoding was specified, use the default.
    if (options.encoding !== null) {
      contents = iconv.decode(contents, options.encoding || file.defaultEncoding);
      // Strip any BOM that might exist.
      if (contents.charCodeAt(0) === 0xFEFF) {
        contents = contents.substring(1);
      }
    }
    grunt.verbose.ok();
    return contents;
  } catch(e) {
    grunt.verbose.error();
    throw grunt.util.error('Unable to read "' + filepath + '" file (Error code: ' + e.code + ').', e);
  }
};

// Read a file, parse its contents, return an object.
file.readJSON = function(filepath, options) {
  var src = file.read(filepath, options);
  var result;
  grunt.verbose.write('Parsing ' + filepath + '...');
  try {
    result = JSON.parse(src);
    grunt.verbose.ok();
    return result;
  } catch(e) {
    grunt.verbose.error();
    throw grunt.util.error('Unable to parse "' + filepath + '" file (' + e.message + ').', e);
  }
};

// Read a YAML file, parse its contents, return an object.
file.readYAML = function(filepath, options) {
  var src = file.read(filepath, options);
  var result;
  grunt.verbose.write('Parsing ' + filepath + '...');
  try {
    result = YAML.load(src);
    grunt.verbose.ok();
    return result;
  } catch(e) {
    grunt.verbose.error();
    throw grunt.util.error('Unable to parse "' + filepath + '" file (' + e.problem + ').', e);
  }
};

// Write a file.
file.write = function(filepath, contents, options) {
  if (!options) { options = {}; }
  var nowrite = grunt.option('no-write');
  grunt.verbose.write((nowrite ? 'Not actually writing ' : 'Writing ') + filepath + '...');
  // Create path, if necessary.
  file.mkdir(path.dirname(filepath));
  try {
    // If contents is already a Buffer, don't try to encode it. If no encoding
    // was specified, use the default.
    if (!Buffer.isBuffer(contents)) {
      contents = iconv.encode(contents, options.encoding || file.defaultEncoding);
    }
    // Actually write file.
    if (!nowrite) {
      fs.writeFileSync(filepath, contents);
    }
    grunt.verbose.ok();
    return true;
  } catch(e) {
    grunt.verbose.error();
    throw grunt.util.error('Unable to write "' + filepath + '" file (Error code: ' + e.code + ').', e);
  }
};

// Read a file, optionally processing its content, then write the output.
file.copy = function(srcpath, destpath, options) {
  if (!options) { options = {}; }
  // If a process function was specified, and noProcess isn't true or doesn't
  // match the srcpath, process the file's source.
  var process = options.process && options.noProcess !== true &&
    !(options.noProcess && file.isMatch(options.noProcess, srcpath));
  // If the file will be processed, use the encoding as-specified. Otherwise,
  // use an encoding of null to force the file to be read/written as a Buffer.
  var readWriteOptions = process ? options : {encoding: null};
  // Actually read the file.
  var contents = file.read(srcpath, readWriteOptions);
  if (process) {
    grunt.verbose.write('Processing source...');
    try {
      contents = options.process(contents);
      grunt.verbose.ok();
    } catch(e) {
      grunt.verbose.error();
      throw grunt.util.error('Error while processing "' + srcpath + '" file.', e);
    }
  }
  // Abort copy if the process function returns false.
  if (contents === false) {
    grunt.verbose.writeln('Write aborted.');
  } else {
    file.write(destpath, contents, readWriteOptions);
  }
};

// Delete folders and files recursively
file.delete = function(filepath, options) {
  filepath = String(filepath);

  var nowrite = grunt.option('no-write');
  if (!options) {
    options = {force: grunt.option('force') || false};
  }

  grunt.verbose.write((nowrite ? 'Not actually deleting ' : 'Deleting ') + filepath + '...');

  // Only delete cwd or outside cwd if --force enabled. Be careful, people!
  if (!options.force) {
    if (file.isPathCwd(filepath)) {
      grunt.verbose.error();
      grunt.fail.warn('Cannot delete the current working directory.');
      return false;
    } else if (!file.isPathInCwd(filepath)) {
      grunt.verbose.error();
      grunt.fail.warn('Cannot delete files outside the current working directory.');
      return false;
    }
  }

  try {
    // Actually delete. Or not.
    if (!nowrite) {
      rimraf.sync(filepath);
    }
    grunt.verbose.ok();
    return true;
  } catch(e) {
    grunt.verbose.error();
    throw grunt.util.error('Unable to delete "' + filepath + '" file (' + e.message + ').', e);
  }
};

// Clear the require cache for all passed filepaths.
file.clearRequireCache = function() {
  // If a non-string argument is passed, it's an array of filepaths, otherwise
  // each filepath is passed individually.
  var filepaths = typeof arguments[0] !== 'string' ? arguments[0] : grunt.util.toArray(arguments);
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
  var dirpath = path.join.apply(path, arguments);
  var homepath = process.env[win32 ? 'USERPROFILE' : 'HOME'];
  dirpath = path.resolve(homepath, '.grunt', dirpath);
  return file.exists(dirpath) ? dirpath : null;
};

// True if the file path exists.
file.exists = function() {
  var filepath = path.join.apply(path, arguments);
  return existsSync(filepath);
};

// True if the file is a symbolic link.
file.isLink = function() {
  var filepath = path.join.apply(path, arguments);
  return file.exists(filepath) && fs.lstatSync(filepath).isSymbolicLink();
};

// True if the path is a directory.
file.isDir = function() {
  var filepath = path.join.apply(path, arguments);
  return file.exists(filepath) && fs.statSync(filepath).isDirectory();
};

// True if the path is a file.
file.isFile = function() {
  var filepath = path.join.apply(path, arguments);
  return file.exists(filepath) && fs.statSync(filepath).isFile();
};

// List of changed / deleted file paths, generated by the watch task.
file.watchFiles = {changed: null, deleted: null};
