'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js'],
    },
    lint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
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
          es5: true,
        },
        globals: {
          exports: true,
        },
      },
    },
    watch: {
      files: '<config:lint.files>',
      tasks: ['lint', 'test'],
    },
  });

  // Default task.
  grunt.registerTask('default', ['lint', 'test']);

};