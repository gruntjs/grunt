'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      bin: {
        src: ['bin/{%= name %}']
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
        files: '<%= lint.gruntfile.src %>',
        tasks: ['lint:gruntfile']
      },
      bin: {
        files: '<%= lint.bin.src %>',
        tasks: ['lint:bin']
      },
      lib: {
        files: '<%= lint.lib.src %>',
        tasks: ['lint:lib', 'test']
      },
      test: {
        files: '<%= lint.test.src %>',
        tasks: ['lint:test', 'test']
      },
    },
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['lint', 'test']);

};
