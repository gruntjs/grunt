/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

module.exports = function(grunt) {

  // Internal lib.
  var jshint = require('./lib/jshint').init(grunt);

  grunt.registerMultiTask('jshint', 'Validate files with JSHint.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      options: {},
      globals: {},
      jshintrc: null
    });

    // If a jshintrc file was specified, read it.
    var jshintrc;
    if (options.jshintrc) {
      jshintrc = grunt.file.readJSON(options.jshintrc);
      delete options.jshintrc;
      // JSHint options and globals will be read from jshintrc file.
      options.options = jshintrc;
      options.globals = {};
      if (jshintrc.predef) {
        // Temp kluge for https://github.com/jshint/node-jshint/issues/104
        jshintrc.predef.forEach(function(key) {
          options.globals[key] = true;
        });
        delete jshintrc.predef;
      }
    }

    grunt.verbose.writeflags(options.options, 'JSHint options');
    grunt.verbose.writeflags(options.globals, 'JSHint globals');

    // Lint specified files.
    var files = grunt.file.expandFiles(grunt.util._.pluck(this.files, 'src'));
    files.forEach(function(filepath) {
      jshint.lint(grunt.file.read(filepath), options.options, options.globals, filepath);
    });

    // Fail task if errors were logged.
    if (this.errorCount) { return false; }

    // Otherwise, print a success message.
    grunt.log.ok(files.length + ' files lint free.');
  });

};
