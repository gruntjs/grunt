/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      all: ['test/**/*.js']
    },
    lint: {
      all: ['grunt.js', 'lib/**/*.js', 'tasks/*.js', 'tasks/*/*.js', 'test/**/*.js']
    },
    watch: {
      scripts: {
        files: '<config:lint.all>',
        tasks: 'lint test'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true,
        strict: false,
        maxparams: 5,
        maxdepth: 4,
        maxstatements: 33,
        maxcomplexity: 15
      },
      globals: {}
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

};
