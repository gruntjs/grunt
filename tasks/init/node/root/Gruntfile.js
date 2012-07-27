'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*.js'],
    },
    lint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<config:lint.gruntfile.src>',
        tasks: ['lint:gruntfile']
      },
      lib: {
        files: '<config:lint.lib.src>',
        tasks: ['lint:lib', 'test']
      },
      test: {
        files: '<config:lint.test.src>',
        tasks: ['lint:test', 'test']
      },
    },
  });

  // Default task.
  grunt.registerTask('default', ['lint', 'test']);

};
