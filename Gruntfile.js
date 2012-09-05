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
    nodeunit: {
      all: ['test/{grunt,tasks,util}/**/*.js']
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/*.js',
        'tasks/*/*.js',
        'tasks/lib/**/*.js',
        '<%= nodeunit.all %>'
      ],
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
    },
    watch: {
      scripts: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint', 'nodeunit']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

  // Unregister unused tasks.
  grunt.unregisterTasks('concat', 'uglify', 'init', 'server', 'qunit');
};
