/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {

  // Nodejs libs.
  var fs = require('fs');
  var path = require('path');

  // External libs.
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
  }

  function AntJUnitXmlResultFormatter (xmlReportFile) {
    this.testSuites = [];
    this.currentTestSuite = null;
    this.currentTest = null;

	// 'Dummy' test suite for tests that are not in a module.
    this.testSuites.push({
      name: '',
      timestamp: new Date(),
      tests: []
    });

    this.moduleStart = function (name) {
      var testSuite = {
        name: name,
        timestamp:  new Date(),
        tests: []
      };

      this.testSuites.push(testSuite);
      this.currentTestSuite = testSuite;
    };

    this.moduleDone = function (name, failed, passed, total) {
      var testSuite = this.currentTestSuite;

      this.currentTestSuite = null;
      this.currentTest = null;
    };

    this.testStart = function (name) {
      var test = {
        name: name,
        startTimestamp: new Date(),
        assertions: []
      };

      if (this.currentTestSuite) {
        this.currentTestSuite.tests.push(test);
      } else {
        this.testSuites[0].tests.push(test);
      }

      this.currentTest = test;
    };

    this.testDone = function (name, failed, passed, total) {
      var test = this.currentTest;

      test.endTimestamp = new Date();
      test.time = test.endTimestamp - test.startTimestamp;
      test.failed = failed;
      test.passed = passed;
      test.total = total;

      this.currentTest = null;
    };

    this.log = function (result, actual, expected, message, source) {
      var test = this.currentTest;

      test.assertions.push({
        result: result,
        actual: actual,
        expected: expected,
        message: message,
        source: source
      });
    };

    this.beginXmlElement = function (elementName, attributes) {
      var formattedAttributes = [],
        attribute;

      for (attribute in attributes || {}) {
        if (Object.prototype.hasOwnProperty.call(attributes, attribute)) {
          formattedAttributes.push(attribute + '="' + this.xmlAttributeEncode(attributes[attribute]) + '"');
        }
      }

      return '<' + elementName + ' ' + formattedAttributes.join(' ') + '>';
    };

    this.endXmlElement = function (elementName) {
      return '</' + elementName + '>';
    };

    this.xmlEncode = function (text) {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;');
    };

    this.xmlAttributeEncode = function (text) {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;');
    };

    this.xmlCData = function (text) {
      return '<![CDATA[' + String(text).replace(/\]\]>/g, ']]]]><![CDATA[>') + ']]>';
    };

    this.allDone = function (callback) {
      var self = this,
        stream = fs.createWriteStream(xmlReportFile, {flags: 'w', encoding: 'utf-8'});

      stream.on('close', function () { callback(); });

      stream.write(this.beginXmlElement('testsuites', {}));

      this.testSuites.forEach(function (testSuite, index) {
        if (index === 0 && !testSuite.tests.length) {
          return;
        }

        stream.write(self.beginXmlElement('testsuite', {
          name: testSuite.name,
          tests: testSuite.tests.length,
          timestamp: grunt.template.date(testSuite.timestamp, 'isoDateTime', true)
        }));

        testSuite.tests.forEach(function (test) {
          stream.write(self.beginXmlElement('testcase', {
            name: test.name,
            assertions: test.total,
            time: test.time / 1000
          }));

          test.assertions.forEach(function (assertion) {
            if (assertion.result) {
              return;
            }

            stream.write(self.beginXmlElement('error', {
              type: 'assertionFailure',
              message: assertion.message
            }));

            stream.write(self.xmlCData(
              'Expected: ' + assertion.expected + '\n' +
              '  Result: ' + assertion.actual + '\n' +
              '  Source: ' + (assertion.source === null ? '' : assertion.source)));

            stream.write(self.endXmlElement('error'));
          });

          stream.write(self.endXmlElement('testcase'));
        });

        stream.write(self.endXmlElement('testsuite'));
      });

      stream.end(this.endXmlElement('testsuites'));
    };
  }

  // Handle methods passed from PhantomJS, including QUnit hooks.
  var phantomHandlers = {
    // QUnit hooks.
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
      grunt.verbose.write(currentTest + '...');
    },
    testDone: function(name, failed, passed, total) {
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
    },
    done: function(failed, passed, total, duration) {
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
    },
    // Error handlers.
    done_fail: function(url) {
      grunt.verbose.write('Running PhantomJS...').or.write('...');
      grunt.log.error();
      grunt.warn('PhantomJS unable to load "' + url + '" URI.', 90);
    },
    done_timeout: function() {
      grunt.log.writeln();
      grunt.warn('PhantomJS timed out, possibly due to a missing QUnit start() call.', 90);
    },
    // console.log pass-through.
    console: console.log.bind(console),
    // Debugging messages.
    debug: grunt.log.debug.bind(grunt.log, 'phantomjs')
  };

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('qunit', 'Run QUnit unit tests in a headless PhantomJS instance.', function() {
    // Get files as URLs.
    var urls = grunt.file.expandFileURLs(this.file.src);

    var resultListeners = [];
    if (this.data.antJUnitXmlReport) {
      resultListeners.push(new AntJUnitXmlResultFormatter(this.data.antJUnitXmlReport));
    }

    // This task is asynchronous.
    var done = this.async();

    // Reset status.
    status = {failed: 0, passed: 0, total: 0, duration: 0};

    // Process each filepath in-order.
    grunt.utils.async.forEachSeries(urls, function(url, next) {
      var basename = path.basename(url);
      grunt.verbose.subhead('Testing ' + basename).or.write('Testing ' + basename);

      // Create temporary file to be used for grunt-phantom communication.
      var tempfile = new Tempfile();
      // Timeout ID.
      var id;
      // The number of tempfile lines already read.
      var n = 0;

      // Reset current module.
      currentModule = null;

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
        // Disable logging temporarily.
        grunt.log.muted = true;
        // Read the file, splitting lines on \n, and removing a trailing line.
        var lines = grunt.file.read(tempfile.path).split('\n').slice(0, -1);
        // Re-enable logging.
        grunt.log.muted = false;
        // Iterate over all lines that haven't already been processed.
        var done = lines.slice(n).some(function(line) {
          // Get args and method.
          var args = JSON.parse(line);
          var method = args.shift();
          // Execute method if it exists.
          if (phantomHandlers[method]) {
            phantomHandlers[method].apply(null, args);
          }
          resultListeners.forEach(function (item) {
            if (item[method]) {
              item[method].apply(item, args);
            }
          });
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
      grunt.helper('phantomjs', {
        code: 90,
        args: [
          // The main script file.
          grunt.task.getFile('qunit/phantom.js'),
          // The temporary file used for communications.
          tempfile.path,
          // The QUnit helper file to be injected.
          grunt.task.getFile('qunit/qunit.js'),
          // URL to the QUnit .html test file to run.
          url,
          // PhantomJS options.
          '--config=' + grunt.task.getFile('qunit/phantom.json')
        ],
        done: function(err) {
          if (err) {
            cleanup();
            done();
          }
        },
      });
    }, function(err) {
      // All tests have been run.

      grunt.utils.async.forEach(resultListeners, function (item, callback) {
        item.allDone(callback);
      }, function (err) {
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
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('phantomjs', function(options) {
    return grunt.utils.spawn({
      cmd: 'phantomjs',
      args: options.args
    }, function(err, result, code) {
      if (!err) { return options.done(null); }
      // Something went horribly wrong.
      grunt.verbose.or.writeln();
      grunt.log.write('Running PhantomJS...').error();
      if (code === 127) {
        grunt.log.errorlns(
          'In order for this task to work properly, PhantomJS must be ' +
          'installed and in the system PATH (if you can run "phantomjs" at' +
          ' the command line, this task should work). Unfortunately, ' +
          'PhantomJS cannot be installed automatically via npm or grunt. ' +
          'See the grunt FAQ for PhantomJS installation instructions: ' +
          'https://github.com/cowboy/grunt/blob/master/docs/faq.md'
        );
        grunt.warn('PhantomJS not found.', options.code);
      } else {
        result.split('\n').forEach(grunt.log.error, grunt.log);
        grunt.warn('PhantomJS exited unexpectedly with exit code ' + code + '.', options.code);
      }
      options.done(code);
    });
  });

};
