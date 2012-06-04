/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

// Nodejs libs.
var path = require('path');

// External libs.
var glob = require('glob-whatev');
var _ = require('underscore');

// Search for a filename in the given directory or all parent directories.
module.exports = function findup(dirpath, patterns) {
  // Normalize patterns to an array.
  if (!Array.isArray(patterns)) { patterns = [patterns]; }
  // Search for files matching patterns.
  var files = _.chain(patterns).map(function(pattern) {
    return glob.glob(pattern, {cwd: dirpath, maxDepth: 1});
  }).flatten().uniq().value();
  // Return file if found.
  if (files.length > 0) { return path.join(dirpath, files[0]); }
  // If parentpath is the same as dirpath, we can't go any higher.
  var parentpath = path.resolve(dirpath, '..');
  return parentpath === dirpath ? null : findup(parentpath, patterns);
};
