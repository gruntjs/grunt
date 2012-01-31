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

var hooker = require('hooker');
var connect = require('connect');
var HTTP = require('http');

// Temporary file to be used for HTTP request socket.
var Tempfile = require('temporary/lib/file');
var tempfile;

// Patch jsdom to add support for "text/grunt" scripts as well as auto-loading
// QUnit grunt reporter code.
var patched;
function patchJsdom() {
  if (patched) { return; }
  // Add a custom "text/grunt" type to zombie's jsdom for custom grunt-only scripts.
  var jsdom = require('zombie/node_modules/jsdom/lib/jsdom');
  var lang = jsdom.dom.level3.html.languageProcessors;
  // Backup the current JavaScript handler.
  lang._javascript = lang.javascript;
  // Override it.
  lang.javascript = function(element, code, filename) {
    // Piggy-back custom QUnit grunt reporter code onto request for qunit.js.
    if (path.basename(filename) === 'qunit.js') {
      code += fs.readFileSync(file.taskfile('qunit/qunit.js'), 'utf-8');
    }
    return this._javascript(element, code, filename);
  };

  // When run from within this task, scripts specified as "text/grunt" will be
  // run like JavaScript!
  lang.grunt = lang.javascript;

  patched = true;
}

// Keep track of the last-started module, test and status.
var currentModule, currentTest, status;
// Keep track of the last-started test(s).
var unfinished = {};

// Keep track of failed assertions for pretty-printing.
var failedAssertions = [];
function logFailedAssertions() {
  var assertion;
  // Print each assertion error.
  while (assertion = failedAssertions.shift()) {
    verbose.or.error(assertion.testName);
    log.error('Message: ' + String(assertion.message).magenta);
    if (assertion.actual !== assertion.expected) {
      log.error('Actual: ' + String(assertion.actual).magenta);
      log.error('Expected: ' + String(assertion.expected).magenta);
    }
    log.error(assertion.source.replace(/ {4}(at)/g, '  $1'));
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

  // Create socket tempfile.
  tempfile = new Tempfile();

  // Hook HTTP.request to use socket file for http://grunt/* requests.
  hooker.hook(HTTP, 'request', function(options) {
    if (options.host === 'grunt') {
      options.socketPath = tempfile.path;
    }
  });

  // Start static file server.
  var server = connect(connect.static(process.cwd())).listen(tempfile.path);

  // Reset status.
  status = {failed: 0, passed: 0, total: 0, duration: 0};

  // Process each filepath in-order.
  async.forEachSeries(filepaths, function(filepath, next) {
    var basename = path.basename(filepath);
    verbose.subhead('Testing ' + basename).or.write('Testing ' + basename);

    // Reset current module.
    currentModule = null;

    // Load test page.
    var zombie = require('zombie');
    patchJsdom();
    var url = 'http://grunt/' + filepath;
    zombie.visit(url, {debug: false, silent: false}, function(e, browser) {
      // Messages are recieved from QUnit via alert!
      browser.onalert(function(message) {
        var args = JSON.parse(message);
        var method = args.shift();
        if (qunit[method]) {
          qunit[method].apply(null, args);
        }
      });
      // Simulate window.load event.
      // https://github.com/assaf/zombie/issues/172
      browser.fire('load', browser.window);
      // Timeout after 10 seconds of nothing.
      browser.wait(10000, function(err, browser) {
        var len = Object.keys(unfinished).length;
        if (len > 0) {
          log.error();
          fail.warn('An async test was missing start().');
        }
        next();
      });
    });
  }, function(err) {
    // All tests have been run.
    server.close();
    // Log results.
    if (status.failed > 0) {
      fail.warn(status.failed + '/' + status.total + ' assertions failed (' +
        status.duration + 'ms)', Math.min(99, 90 + status.failed));
    } else {
      verbose.writeln();
      log.ok(status.total + ' assertions passed (' + status.duration + 'ms)');
    }
    // Clean up.
    hooker.unhook(HTTP, 'request');
    tempfile.unlink();
    // All done!
    done();
  });
});
