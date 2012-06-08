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
    // Get any task- or target-specific options.
    var options = this.options();
    // The source files to be concatenated.
    var files = grunt.file.expandFiles(this.file.src);
    // Concat specified files.
    var src = grunt.helper('concat', files, {separator: options.separator});
    // Write the destination file.
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
    // Passed options override default options.
    options = grunt.util._.defaults(options || {}, {
      separator: grunt.util.linefeed
    });
    // If files were specified, iterate over each file, joining them on the
    // specified separator (or the default).
    return files ? files.map(function(filepath) {
      // If the filepath is a directive, return its expanded value, otherwise
      // read the filepath's contents and return that.
      return grunt.task.directive(filepath, grunt.file.read);
    }).join(grunt.util.normalizelf(options.separator)) : '';
  });

};
