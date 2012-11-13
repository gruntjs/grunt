/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
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
        '<%= nodeunit.all %>',
        'test/gruntfile/*.js',
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
        unused: true,
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

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // "npm test" runs these tasks
  grunt.registerTask('npm-test', ['jshint', 'nodeunit']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

  // Unregister unused tasks.
  grunt.unregisterTasks('init');
};
