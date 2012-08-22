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

  // Project configuration.
  grunt.initConfig({
    test: {
      all: ['test/{grunt,tasks,util}/**/*.js']
    },
    lint: {
      all: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/*.js',
        'tasks/*/*.js',
        'test/**/*.js',
        '!test/fixtures/**/*.js'
      ],
      options: {
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
          es5: true
        }
      }
    },
    watch: {
      scripts: {
        files: '<config:lint.all>',
        tasks: ['lint', 'test']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['lint', 'test']);

  // Unregister unused tasks.
  grunt.unregisterTasks('concat', 'min', 'init', 'server', 'qunit');
};
