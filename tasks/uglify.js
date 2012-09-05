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
  var uglify = require('./lib/uglify').init(grunt);

  grunt.registerMultiTask('uglify', 'Minify files with UglifyJS.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      banner: '',
      uglify: {}
    });

    // Process banner.
    var banner = grunt.template.process(options.banner);

    // Iterate over all specified file groups.
    this.files.forEach(function(fileObj) {
      // The source file to be minified.
      var srcpath = fileObj.src[0];
      var files = grunt.file.expandFiles(srcpath);
      // Abort if source didn't match any files.
      if (files.length === 0) {
        grunt.log.error('Source file "' + srcpath + '" not found.');
        return;
      }

      // Get source of specified file.
      var max = grunt.file.read(files[0]);
      // Concat banner + minified source.
      var min = banner + uglify.minify(max, options.uglify);

      // Write the destination file.
      grunt.file.write(fileObj.dest, min);
      // Print a success message.
      grunt.log.writeln('File "' + fileObj.dest + '" created.');
      // ...and report some size information.
      uglify.info(min, max);
    }, this);

    // Fail task if any errors were logged.
    if (this.errorCount > 0) { return false; }
  });

};
