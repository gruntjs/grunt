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

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      all: ['test/{grunt,tasks,util}/**/*.js']
    },
    jshint: {
      gruntfile: ['Gruntfile.js'],
      libs_n_tests: ['lib/**/*.js', '<%= nodeunit.all %>'],
      subgrunt: ['<%= subgrunt.all %>'],
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
      gruntfile: {
        files: ['<%= jshint.gruntfile %>'],
        tasks: ['jshint:gruntfile']
      },
      libs_n_tests: {
        files: ['<%= jshint.libs_n_tests %>'],
        tasks: ['jshint:libs_n_tests', 'nodeunit']
      },
      subgrunt: {
        files: ['<%= subgrunt.all %>'],
        tasks: ['jshint:subgrunt', 'subgrunt']
      }
    },
    subgrunt: {
      all: ['test/gruntfile/*.js']
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Some internal tasks. Maybe someday these will be released.
  grunt.loadTasks('internal-tasks');

  // "npm test" runs these tasks
  grunt.registerTask('test', ['jshint', 'nodeunit', 'subgrunt']);

  // Default task.
  grunt.registerTask('default', ['test']);

};
