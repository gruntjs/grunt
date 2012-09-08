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
var uglifyjs = require('uglify-js');
var gzip = require('gzip-js');

exports.init = function(grunt) {
  var exports = {};

  // Minify with UglifyJS.
  // From https://github.com/mishoo/UglifyJS
  exports.minify = function(src, options) {
    if (!options) { options = {}; }
    var jsp = uglifyjs.parser;
    var pro = uglifyjs.uglify;
    var ast, pos;
    var msg = 'Minifying with UglifyJS...';
    grunt.verbose.write(msg);
    try {
      ast = jsp.parse(src);
      if (options.mangle !== false) {
        ast = pro.ast_mangle(ast, options.mangle || {});
      }
      if (options.squeeze !== false) {
        ast = pro.ast_squeeze(ast, options.squeeze || {});
      }
      src = pro.gen_code(ast, options.codegen || {});
      // Success!
      grunt.verbose.ok();
      // UglifyJS adds a trailing semicolon only when run as a script.
      // So we manually add the trailing semicolon when using it as a module.
      // https://github.com/mishoo/UglifyJS/issues/126
      return src + ';';
    } catch(e) {
      // Something went wrong.
      grunt.verbose.or.write(msg);
      pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + e.col).yellow + ']'.red;
      grunt.log.error().writeln(pos + ' ' + (e.message + ' (position: ' + e.pos + ')').yellow);
      grunt.warn('UglifyJS found errors.', 10);
    }
  };

  return exports;
};
