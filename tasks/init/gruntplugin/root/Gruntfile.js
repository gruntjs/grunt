/*
 * {%= name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
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
      },
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<config:nodeunit.tests>'
      ],
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    {%= short_name %}: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!',
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // The clean plugin helps in testing.
  //grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('clean', 'Clean up some shizzle.', function() {
    if (grunt.file.exists('tmp')) { grunt.file.delete('tmp'); }
  });

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', '{%= short_name %}', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
