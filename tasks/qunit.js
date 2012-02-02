/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var Tempfile = require('temporary/lib/file');

// Keep track of the last-started module, test and status.
var currentModule, currentTest, status;
// Keep track of the last-started test(s).
var unfinished = {};

// Allow an error message to retain its color when split across multiple lines.
function formatMessage(str) {
  return String(str).split('\n').map(function(s) { return s.magenta; }).join('\n');
}

// Keep track of failed assertions for pretty-printing.
var failedAssertions = [];
function logFailedAssertions() {
  var assertion;
  // Print each assertion error.
  while (assertion = failedAssertions.shift()) {
    verbose.or.error(assertion.testName);
    log.error('Message: ' + formatMessage(assertion.message));
    if (assertion.actual !== assertion.expected) {
      log.error('Actual: ' + formatMessage(assertion.actual));
      log.error('Expected: ' + formatMessage(assertion.expected));
    }
    if (assertion.source) {
      log.error(assertion.source.replace(/ {4}(at)/g, '  $1'));
    }
    log.writeln();
  }
}

// QUnit hooks.
var qunit = {
  moduleStart: function(name) {
    unfinished[name] = true;
    currentModule = name;
  },
  moduleDone: function(name, failed, passed, total) {
    delete unfinished[name];
  },
  log: function(result, actual, expected, message, source) {
    if (!result) {
      failedAssertions.push({
        actual: actual, expected: expected, message: message, source: source,
        testName: currentTest
      });
    }
  },
  testStart: function(name) {
    currentTest = (currentModule ? currentModule + ' - ' : '') + name;
    verbose.write(currentTest + '...');
  },
  testDone: function(name, failed, passed, total) {
    // Log errors if necessary, otherwise success.
    if (failed > 0) {
      // list assertions
      if (option('verbose')) {
        log.error();
        logFailedAssertions();
      } else {
        log.write('F'.red);
      }
    } else {
      verbose.ok().or.write('.');
    }
  },
  done: function(failed, passed, total, duration) {
    status.failed += failed;
    status.passed += passed;
    status.total += total;
    status.duration += duration;
    // Print assertion errors here, if verbose mode is disabled.
    if (!option('verbose')) {
      if (failed > 0) {
        log.writeln();
        logFailedAssertions();
      } else {
        log.ok();
      }
    }
  },
  done_timeout: function() {
    log.writeln();
    fail.warn('PhantomJS timed out, possibly due to a missing QUnit start() call.', 90);
  }
};

// ============================================================================
// TASKS
// ============================================================================

task.registerBasicTask('qunit', 'Run qunit tests in a headless browser.', function(data, name) {
  // File paths.
  var filepaths = file.expand(data);

  // This task is asynchronous.
  var done = this.async();

  // Reset status.
  status = {failed: 0, passed: 0, total: 0, duration: 0};

  // Process each filepath in-order.
  async.forEachSeries(filepaths, function(filepath, next) {
    var basename = path.basename(filepath);
    verbose.subhead('Testing ' + basename).or.write('Testing ' + basename);

    // Create temporary file to be used for grunt-phantom communication.
    var tempfile = new Tempfile();
    // Timeout ID.
    var id;
    // The number of tempfile lines already read.
    var n = 0;

    // Reset current module.
    currentModule = null;

    // This function needs to be defined here to be able to access "filepath".
    qunit.done_fail = function(url) {
      log.writeln();
      fail.warn('PhantomJS unable to load "' + filepath + '" file.', 90);
    };

    // Clean up.
    function cleanup() {
      clearTimeout(id);
      tempfile.unlink();
    }

    // It's simple. As QUnit tests, assertions and modules begin and complete,
    // the results are written as JSON to a temporary file. This polling loop
    // checks that file for new lines, and for each one parses its JSON and
    // executes the corresponding method with the specified arguments.
    (function loopy() {
      // Read the file, splitting lines on \n, and removing a trailing line.
      var lines = fs.readFileSync(tempfile.path, 'utf-8').split('\n').slice(0, -1);
      // Iterate over all lines that haven't already been processed.
      var done = lines.slice(n).some(function(line) {
        // Get args and method.
        var args = JSON.parse(line);
        var method = args.shift();
        // Execute method if it exists.
        if (qunit[method]) {
          qunit[method].apply(null, args);
        }
        // If the method name started with test, return true. Because the
        // Array#some method was used, this not only sets "done" to true,
        // but stops further iteration from occurring.
        return (/^done/).test(method);
      });

      if (done) {
        // All done.
        cleanup();
        next();
      } else {
        // Update n so previously processed lines are ignored.
        n = lines.length;
        // Check back in a little bit.
        id = setTimeout(loopy, 100);
      }
    }());

    // Launch PhantomJS.
    var args = [
      // The main script file.
      file.taskfile('qunit/phantom.js'),
      // The temporary file used for communications.
      tempfile.path,
      // The QUnit helper file to be injected.
      file.taskfile('qunit/qunit.js'),
      // The QUnit .html test file to run.
      'file://' + path.resolve(filepath),
      // PhantomJS options.
      '--config=' + file.taskfile('qunit/phantom.json')
    ];

    spawn('phantomjs', args).on('exit', function (code) {
      if (code === 0) { return; }
      // Something went horribly wrong.
      cleanup();
      log.writeln();
      if (code === 127) {
        fail.warn('PhantomJS not found. Visit www.phantomjs.org for installation instructions.', 90);
      } else {
        fail.warn('PhantomJS exited abruptly with exit code ' + code + '.', 90);
      }
      next();
    });

  }, function(err) {
    // All tests have been run.

    // Log results.
    if (status.failed > 0) {
      fail.warn(status.failed + '/' + status.total + ' assertions failed (' +
        status.duration + 'ms)', Math.min(99, 90 + status.failed));
    } else {
      verbose.writeln();
      log.ok(status.total + ' assertions passed (' + status.duration + 'ms)');
    }

    // All done!
    done();
  });
});
