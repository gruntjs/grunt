/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 'Cowboy' Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

// External libs.
var esprima = require('esprima');
var escodegen = require('escodegen');
var esmangle = require('esmangle');

exports.init = function(grunt) {
  var exports = {};

  exports.banner_from_ast = function(ast) {

    var comment = ast.comments[0];
    var output = "";

    if(comment) {
      // only accept banner starting at line 0
      if(comment.range[0] === 0) {
        if(comment.type === 'Block') {
          output = '/*'+comment.value+'*/\n';
        } else if (comment.type === 'Line') {
          output = '//'+comment.value+'\n';
        }
      }
    }

    return output;
  };

  // Minify with Esprima.
  // From https://github.com/mishoo/UglifyJS
  exports.minify = function(src, options) {
    if (!options) { options = {}; }

    // ensure comments are always retained in the ast
    options.esprima = options.esprima||{};
    options.esprima.comment = true;

    options.escodegen = options.escodegen||{ format: { compact: true }};

    var ast, pos;
    var msg = 'Minifying with UglifyJS...';
    grunt.verbose.write(msg);
    try {
      // Parse to AST using esprima
      ast = esprima.parse(src, options.esprima);
      // Minify using esmangle (more could be added here)
      // http://constellation.github.com/esmangle/
      ast = esmangle.mangle(ast, options.esmangle||{});
      // Generate JS using escodegen
      src = escodegen.generate(ast, options.escodegen||{});
      // Add banner
      src = exports.banner_from_ast(ast)+src;
      // Success!
      grunt.verbose.ok();
      return src;
    } catch(e) {
      // Something went wrong.
      grunt.verbose.or.write(msg);
      pos = '['.red + ('L' + e.lineNumber).yellow + ':'.red + ('C' + e.column).yellow + ']'.red;
      grunt.log.error().writeln(pos + ' ' + (e.message + ' (position: ' + e.index + ')').yellow);
      grunt.warn('Esprima found errors.', 10);
    }
  };

  return exports;
};
