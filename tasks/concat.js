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

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('concat', 'Concatenate files.', function() {
    var files = grunt.file.expandFiles(this.file.src);
    // Concat specified files.
    var src = grunt.helper('concat', files, {separator: this.data.separator});
    grunt.file.write(this.file.dest, src);

    // Fail task if errors were logged.
    if (this.errorCount) { return false; }

    // Otherwise, print a success message.
    grunt.log.writeln('File "' + this.file.dest + '" created.');
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  // Concat source files and/or directives.
  grunt.registerHelper('concat', function(files, options) {
    options = grunt.util._.defaults(options || {}, {
      separator: grunt.util.linefeed
    });
    return files ? files.map(function(filepath) {
      return grunt.task.directive(filepath, grunt.file.read);
    }).join(grunt.util.normalizelf(options.separator)) : '';
  });

};
