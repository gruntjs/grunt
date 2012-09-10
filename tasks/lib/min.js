/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

// External libs.
var gzip = require('gzip-js');

exports.init = function(grunt) {
  var exports = {};

  // Return gzipped source.
  exports.gzip = function(src) {
    return src ? gzip.zip(src, {}) : '';
  };

  // Output some size info about a file.
  exports.info = function(min, max) {
    var gzipSize = String(exports.gzip(min).length);
    grunt.log.writeln('Uncompressed size: ' + String(max.length).green + ' bytes.');
    grunt.log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + String(min.length).green + ' bytes minified).');
  };

  return exports;
};
