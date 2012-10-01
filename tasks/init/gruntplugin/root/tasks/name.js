/*
 * {%= name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task
  // creation: https://github.com/gruntjs/grunt/blob/devel/docs/toc.md

  grunt.registerMultiTask('{%= short_name %}', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(fileObj) {
      // The source files to be concatenated. The "nonull" option is used
      // to retain invalid files/patterns so they can be warned about.
      var files = grunt.file.expand({nonull: true}, fileObj.src);

      // Concat specified files.
      var src = files.map(function(filepath) {
        // Warn if a source file/pattern was invalid.
        if (!grunt.file.exists(filepath)) {
          grunt.log.error('Source file "' + filepath + '" not found.');
          return '';
        }
        // Read file source.
        return grunt.file.read(filepath);
      }).join(options.separator);

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(fileObj.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + fileObj.dest + '" created.');
    });
  });

};
