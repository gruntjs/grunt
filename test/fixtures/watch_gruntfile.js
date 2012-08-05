'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'watch/**/*.js',
        '!watch/dontwatch.js'
      ]
    },
    nodeunit: {
      all: ['watch/test/*.js']
    },
    watch: {
      scripts: {
        files: ['<%= jshint.all %>', 'watch/test/*.js'],
        tasks: ['jshint', 'nodeunit']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'nodeunit']);
};