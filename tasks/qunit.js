/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

module.exports = function(grunt) {

  // Nodejs libs.
  var path = require('path');

  // Internal lib.
  var phantomjs = require('./lib/phantomjs').init(grunt);

  // Keep track of the last-started module, test and status.
  var currentModule, currentTest, status;
  // Keep track of the last-started test(s).
  var unfinished = {};

  // Allow an error message to retain its color when split across multiple lines.
  var formatMessage = function(str) {
    return String(str).split('\n').map(function(s) { return s.magenta; }).join('\n');
  };

  // Keep track of failed assertions for pretty-printing.
  var failedAssertions = [];
  var logFailedAssertions = function() {
    var assertion;
    // Print each assertion error.
    while (assertion = failedAssertions.shift()) {
      grunt.verbose.or.error(assertion.testName);
      grunt.log.error('Message: ' + formatMessage(assertion.message));
      if (assertion.actual !== assertion.expected) {
        grunt.log.error('Actual: ' + formatMessage(assertion.actual));
        grunt.log.error('Expected: ' + formatMessage(assertion.expected));
      }
      if (assertion.source) {
        grunt.log.error(assertion.source.replace(/ {4}(at)/g, '  $1'));
      }
      grunt.log.writeln();
    }
  };

  // QUnit hooks.
  phantomjs.on('qunit.moduleStart', function(name) {
    unfinished[name] = true;
    currentModule = name;
  });

  phantomjs.on('qunit.moduleDone', function(name, failed, passed, total) {
    delete unfinished[name];
  });

  phantomjs.on('qunit.log', function(result, actual, expected, message, source) {
    if (!result) {
      failedAssertions.push({
        actual: actual, expected: expected, message: message, source: source,
        testName: currentTest
      });
    }
  });

  phantomjs.on('qunit.testStart', function(name) {
    currentTest = (currentModule ? currentModule + ' - ' : '') + name;
    grunt.verbose.write(currentTest + '...');
  });

  phantomjs.on('qunit.testDone', function(name, failed, passed, total) {
    // Log errors if necessary, otherwise success.
    if (failed > 0) {
      // list assertions
      if (grunt.option('verbose')) {
        grunt.log.error();
        logFailedAssertions();
      } else {
        grunt.log.write('F'.red);
      }
    } else {
      grunt.verbose.ok().or.write('.');
    }
  });

  phantomjs.on('qunit.done', function(failed, passed, total, duration) {
    phantomjs.halt();
    status.failed += failed;
    status.passed += passed;
    status.total += total;
    status.duration += duration;
    // Print assertion errors here, if verbose mode is disabled.
    if (!grunt.option('verbose')) {
      if (failed > 0) {
        grunt.log.writeln();
        logFailedAssertions();
      } else {
        grunt.log.ok();
      }
    }
  });

  // Re-broadcast qunit events on grunt.event.
  phantomjs.on('qunit.*', function() {
    var args = [this.event].concat(grunt.util.toArray(arguments));
    grunt.event.emit.apply(grunt.event, args);
  });

  // Built-in error handlers.
  phantomjs.on('fail.load', function(url) {
    phantomjs.halt();
    grunt.verbose.write('Running PhantomJS...').or.write('...');
    grunt.log.error();
    grunt.warn('PhantomJS unable to load "' + url + '" URI.', 90);
  });

  phantomjs.on('fail.timeout', function() {
    phantomjs.halt();
    grunt.log.writeln();
    grunt.warn('PhantomJS timed out, possibly due to a missing QUnit start() call.', 90);
  });

  // Pass-through console.log statements.
  phantomjs.on('console', console.log.bind(console));

  grunt.registerMultiTask('qunit', 'Run QUnit unit tests in a headless PhantomJS instance.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      // Default PhantomJS timeout.
      timeout: 5000,
      // QUnit-PhantomJS bridge file to be injected.
      inject: grunt.task.getFile('qunit/qunit-phantomjs-bridge.js'),
      // PhantomJS config file.
      '--config': grunt.task.getFile('qunit/phantomjs.json')
    });

    // Get files as URLs.
    var urls = grunt.file.expandFileURLs(grunt.util._.pluck(this.files, 'src'));

    // This task is asynchronous.
    var done = this.async();

    // Reset status.
    status = {failed: 0, passed: 0, total: 0, duration: 0};

    // Process each filepath in-order.
    grunt.util.async.forEachSeries(urls, function(url, next) {
      var basename = path.basename(url);
      grunt.verbose.subhead('Testing ' + basename).or.write('Testing ' + basename);

      // Reset current module.
      currentModule = null;

      // Launch PhantomJS.
      phantomjs.spawn(url, {
        // Exit code to use if PhantomJS fails in an uncatchable way.
        failCode: 90,
        // Additional PhantomJS options.
        options: options,
        // Do stuff when done.
        done: function(err) {
          if (err) {
            // If there was an error, abort the series.
            done();
          } else {
            // Otherwise, process next url.
            next();
          }
        },
      });
    },
    // All tests have been run.
    function(err) {
      // Log results.
      if (status.failed > 0) {
        grunt.warn(status.failed + '/' + status.total + ' assertions failed (' +
          status.duration + 'ms)', Math.min(99, 90 + status.failed));
      } else {
        grunt.verbose.writeln();
        grunt.log.ok(status.total + ' assertions passed (' + status.duration + 'ms)');
      }
      // All done!
      done();
    });
  });

};
