/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {
  // Grunt utilities.
  var task = grunt.task;
  var file = grunt.file;
  var utils = grunt.utils;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('concat', 'Concatenate files.', function(target) {
    // Concat specified files.
    var files = file.expand(this.file.src);
    file.write(this.file.dest, grunt.helper('concat', files));

    // Fail task if errors were logged.
    if (task.hadErrors()) { return false; }

    // Otherwise, print a success message.
    log.writeln('File "' + this.file.dest + '" created.');
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  // Concat source files and/or directives.
  grunt.registerHelper('concat', function(files) {
    return files ? files.map(function(filepath) {
      return task.directive(filepath, file.read);
    }).join(utils.linefeed) : '';
  });

};
