/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// Nodejs libs.
var path = require('path');
var fs = require('fs');
var pathExistsSync = fs.existsSync || path.existsSync;

// Search for a filename in the given directory or all parent directories.
module.exports = function findup(dirpath, filename) {
  var filepath = path.join(dirpath, filename);
  // Return file if found.
  if (pathExistsSync(filepath)) { return filepath; }
  // If parentpath is the same as dirpath, we can't go any higher.
  var parentpath = path.resolve(dirpath, '..');
  return parentpath === dirpath ? null : findup(parentpath, filename);
};
