'use strict';

var Log = require('grunt-legacy-log').Log;
var assert = require('assert');
var through = require('through2');

module.exports = function(grunt) {
  grunt.file.setBase('../fixtures/load-npm-tasks');

  // Create a custom log to assert output
  var stdout = [];
  var oldlog = grunt.log;
  var stream = through(function(data, enc, next) {
    stdout.push(data.toString());
    next(null, data);
  });
  stream.pipe(process.stdout);
  var log = new Log({
    grunt: grunt,
    outStream: stream,
  });
  grunt.log = log;

  // Load a npm task
  grunt.loadNpmTasks('grunt-foo-plugin');

  // Run them
  grunt.registerTask('default', ['foo', 'done']);

  // Assert they loaded and ran correctly
  grunt.registerTask('done', function() {
    grunt.log = oldlog;
    stdout = stdout.join('\n');
    try {
      assert.ok(stdout.indexOf('foo has ran.') !== -1, 'oh-four task should have ran.');
    } catch (err) {
      grunt.log.subhead(err.message);
      grunt.log.error('Expected ' + err.expected + ' but actually: ' + err.actual);
      throw err;
    }
  });
};
