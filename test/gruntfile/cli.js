/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

// For now, run this "test suite" with:
// grunt --gruntfile ./test/gruntfile/cli.js

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var assert = require('assert');
  var cliPath = require.resolve('../../lib/grunt/cli.js');
  var origArgv = null;
  var cliTestsRan = 0;

  grunt.initConfig({
    testcli: {
      '--debug --verbose': function(done) {
        assert.equal(this.options.debug, 1, '--debug flag should have equaled 1');
        assert.ok(this.options.verbose, '--verbose should have been true');
        done();
      }
    }
  });

  // Run tests against the cli
  grunt.registerMultiTask('testcli', function() {
    var done = this.async();
    // Target is the args to run
    var argv = this.target.split(' ');
    // Config value is a function with assertions
    var fn = grunt.config([this.name, this.target]);
    // Increment the tests that have ran
    cliTestsRan++;

    // Clear the cache to the cli to reload and reset the process.argv mapping
    delete require.cache[cliPath];
    // Store the orig process.argv to restore later
    origArgv = process.argv;
    // Set the process.argv before requiring the cli lib
    process.argv = ['node', 'file.js', '--gruntfile', path.join(__dirname, 'cli.js')].concat(argv);
    var cli = require(cliPath);
    // Set tasks on the cli and run it
    cli.tasks = ['noop'];
    cli(false, function() {
      process.argv = origArgv;
      fn.call(cli, done);
    });
  });

  // An empty task to run for faster tests
  grunt.registerTask('noop', 'Do absolutely nothing.', function() {});

  // Run at the end to ensure the expected amount of tests have ran
  grunt.registerTask('testcli-count', function() {
    var expected = Object.keys(grunt.config('testcli')).length;
    assert.equal(expected, cliTestsRan);
  });

  // Default task to run
  grunt.registerTask('default', ['testcli', 'testcli-count']);
};
