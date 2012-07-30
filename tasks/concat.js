/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('concat', 'Concatenate files.', function() {
    var files = grunt.file.expandFiles(this.file.src);
    // Concat specified files.
    var src = grunt.helper('concat', files, {separator: this.data.separator});

    var prefix = this.data.prefix || "";
    var suffix = this.data.suffix || "";

    grunt.file.write(this.file.dest, prefix + src + suffix);

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
    options = grunt.utils._.defaults(options || {}, {
      separator: grunt.utils.linefeed
    });
    return files ? files.map(function(filepath) {
      return grunt.task.directive(filepath, grunt.file.read);
    }).join(grunt.utils.normalizelf(options.separator)) : '';
  });

};
