/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

module.exports = function(grunt) {

  // Run sub-grunt files, because right now, testing tasks is a pain.
  grunt.registerMultiTask('subgrunt', 'Run a sub-gruntfile.', function() {
    var path = require('path');
    grunt.util.async.forEachSeries(this.filesSrc, function(gruntfile, next) {
      grunt.util.spawn({
        grunt: true,
        args: ['--gruntfile', path.resolve(gruntfile)],
      }, function(error, result) {
        if (error) {
          grunt.log.error(result.stdout).writeln();
          next(new Error('Error running sub-gruntfile "' + gruntfile + '".'));
        } else {
          grunt.verbose.ok(result.stdout);
          next();
        }
      });
    }, this.async());
  });

};
