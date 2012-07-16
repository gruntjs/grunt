/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {

  // External libs.
  var uglifyjs = require('uglify-js');
  var gzip = require('gzip-js');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('min', 'Minify files.', function() {
    var files = grunt.file.expandFiles(this.file.src);
    // Get banner, if specified. It would be nice if UglifyJS supported ignoring
    // all comments matching a certain pattern, like /*!...*/, but it doesn't.
    var banner = grunt.task.directive(files[0], function() { return null; });
    if (banner === null) {
      banner = '';
    } else {
      files.shift();
    }
    // Concat specified files. This should really be a single, pre-built (and
    // linted) file, but it supports any number of files.
    var max = grunt.helper('concat', files, {separator: this.data.separator});

    var done = this.async();

    function complete(code) {
      // Fail task if errors were logged.
      if (this.errorCount) { done(false); return; }

      // Concat banner + minified source.
      var min = banner + code;
      grunt.file.write(this.file.dest, min);

      // Otherwise, print a success message....
      grunt.log.writeln('File "' + this.file.dest + '" created.');
      // ...and report some size information.
      grunt.helper('min_max_info', min, max);

      done();
    }

    var helper = this.data.helper || 'uglify';

    var that = this;
    grunt.helper(helper, max, grunt.config(helper), function(code) {
      complete.call(that, code);
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  // Minify with UglifyJS.
  // From https://github.com/mishoo/UglifyJS
  grunt.registerHelper('uglify', function(src, options, callback) {
    if (!options) { options = {}; }
    var jsp = uglifyjs.parser;
    var pro = uglifyjs.uglify;
    var ast, pos;
    var msg = 'Minifying with UglifyJS...';
    grunt.verbose.write(msg);
    try {
      ast = jsp.parse(src);
      ast = pro.ast_mangle(ast, options.mangle || {});
      ast = pro.ast_squeeze(ast, options.squeeze || {});
      src = pro.gen_code(ast, options.codegen || {});
      // Success!
      grunt.verbose.ok();
      // UglifyJS adds a trailing semicolon only when run as a binary.
      // So we manually add the trailing semicolon when using it as a module.
      // https://github.com/mishoo/UglifyJS/issues/126
      callback(src + ';');
    } catch(e) {
      // Something went wrong.
      grunt.verbose.or.write(msg);
      pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + e.col).yellow + ']'.red;
      grunt.log.error().writeln(pos + ' ' + (e.message + ' (position: ' + e.pos + ')').yellow);
      grunt.warn('UglifyJS found errors.', 10);
      callback(null);
    }
  });

  // Return gzipped source.
  grunt.registerHelper('gzip', function(src) {
    return src ? gzip.zip(src, {}) : '';
  });

  // Output some size info about a file.
  grunt.registerHelper('min_max_info', function(min, max) {
    var gzipSize = String(grunt.helper('gzip', min).length);
    grunt.log.writeln('Uncompressed size: ' + String(max.length).green + ' bytes.');
    grunt.log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + String(min.length).green + ' bytes minified).');
  });

};
