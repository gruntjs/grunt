/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

// For now, run this "test suite" with:
// grunt --gruntfile ./test/gruntfile/multi-task-files.js

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    version: '1.0.0',
    run: {
      options: {a: 1, b: 11},
      // This is the "compact" format, where the target name is actually the
      // dest filename. Doesn't support per-target options, templated dest, or
      // >1 srcs-dest grouping.
      'dist/built.js': 'src/file.js',
      'dist/built1.js': ['src/file.js', 'src/file_1a.js'],
      // This is the "medium" format. The target name is arbitrary and can be
      // used like "grunt run:built". Supports per-target options, templated
      // dest, and arbitrary "extra" paramters. Doesn't support >1 srcs-dest
      // grouping.
      built: {
        options: {a: 2, c: 22},
        src: ['src/file.js', 'src/file_2a.js'],
        dest: 'dist/built-<%= version %>.js',
        extra: 123,
      },
      // This is the "full" format. The target name is arbitrary and can be
      // used like "grunt run:long1". Supports per-target options, templated
      // dest and >1 srcs-dest grouping.
      long1: {
        options: {a: 3, c: 33},
        files: {
          'dist/built-<%= version %>-3a.js': ['src/file.js', 'src/file_3a.js'],
          'dist/built-<%= version %>-3b.js': ['src/file.js', 'src/file_3b.js'],
        }
      },
      long2: {
        options: {a: 4, c: 44},
        files: [
          {'dist/built-<%= version %>-4a.js': ['src/file.js', 'src/file_4a.js']},
          {'dist/built-<%= version %>-4b.js': ['src/file.js', 'src/file_4b.js']},
        ]
      },
      // This "full" variant supports per srcs-dest arbitrary "extra" paramters.
      long3: {
        options: {a: 5, c: 55},
        files: [
          {dest: 'dist/built-<%= version %>-5a.js', src: ['src/file.js', 'src/file_5a.js'], extra: 456},
          {dest: 'dist/built-<%= version %>-5b.js', src: ['src/file.js', 'src/file_5b.js'], extra: 789},
        ]
      },
      // Need to ensure the task function is run if no files or options were
      // specified!
      no_files_or_options: {},
    },
  });

  var results = {};

  grunt.registerMultiTask('run', 'Store stuff for later testing.', function() {
    var key = this.nameArgs;
    var result = results[key];
    if (!result) {
      result = results[key] = [];
    }
    result.push({
      options: this.options({d: 9}),
      file: this.file
    });
  });

  var expecteds = {
    'run:dist/built.js': [
      {
        options: {a: 1, b: 11, d: 9},
        file: {dest: 'dist/built.js', src: ['src/file.js']},
      },
    ],
    'run:dist/built1.js': [
      {
        options: {a: 1, b: 11, d: 9},
        file: {dest: 'dist/built1.js', src: ['src/file.js', 'src/file_1a.js']},
      },
    ],
    'run:built': [
      {
        options: {a: 2, b: 11, c: 22, d: 9},
        file: {dest: 'dist/built-1.0.0.js', src: ['src/file.js', 'src/file_2a.js'], extra: 123},
      },
    ],
    'run:long1': [
      {
        options: {a: 3, b: 11, c: 33, d: 9},
        file: {dest: 'dist/built-1.0.0-3a.js', src: ['src/file.js', 'src/file_3a.js']},
      },
      {
        options: {a: 3, b: 11, c: 33, d: 9},
        file: {dest: 'dist/built-1.0.0-3b.js', src: ['src/file.js', 'src/file_3b.js']},
      },
    ],
    'run:long2': [
      {
        options: {a: 4, b: 11, c: 44, d: 9},
        file: {dest: 'dist/built-1.0.0-4a.js', src: ['src/file.js', 'src/file_4a.js']},
      },
      {
        options: {a: 4, b: 11, c: 44, d: 9},
        file: {dest: 'dist/built-1.0.0-4b.js', src: ['src/file.js', 'src/file_4b.js']},
      },
    ],
    'run:long3': [
      {
        options: {a: 5, b: 11, c: 55, d: 9},
        file: {dest: 'dist/built-1.0.0-5a.js', src: ['src/file.js', 'src/file_5a.js'], extra: 456},
      },
      {
        options: {a: 5, b: 11, c: 55, d: 9},
        file: {dest: 'dist/built-1.0.0-5b.js', src: ['src/file.js', 'src/file_5b.js'], extra: 789},
      },
    ],
    'run:no_files_or_options': [
      {
        options: {a: 1, b: 11, d: 9},
        file: {},
      },
    ],
};

  var assert = require('assert');

  grunt.registerTask('test', 'Actually test results.', function() {
    var key = 'run:' + this.nameArgs.replace(/^.*?:/, '');
    var all = key === 'run:all';
    var actual = all ? results : results[key];
    var expected = all ? expecteds : expecteds[key];

    try {
      assert.deepEqual(actual, expected, 'Actual should match expected.');
    } catch (err) {
      grunt.log.subhead('Assertion Failure in ' + key);
      console.log('Actual\n', JSON.stringify(err.actual));
      console.log('Expected\n', JSON.stringify(err.expected));
      throw new Error(err.message);
    }

    if (all) {
      results = {};
    } else {
      delete results[key];
    }
  });

  grunt.registerTask('default', [
    'run',
    'test:all',
    'run:no_files_or_options',
    'test:no_files_or_options',
    'run:dist/built.js',
    'test:dist/built.js',
    'run:dist/built1.js',
    'test:dist/built1.js',
    'run:built',
    'test:built',
    'run:long1',
    'test:long1',
    'run:long2',
    'test:long2',
    'run:long3',
    'test:long3',
  ]);

};
