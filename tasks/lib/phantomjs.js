/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

// External libs.
var semver = require('semver');
var Tempfile = require('temporary/lib/file');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

exports.init = function(grunt) {
  var exports = new EventEmitter2({wildcard: true});

  // Call this when everything has finished successfully... or when something
  // horrible happens, and you need to clean up and abort.
  var halted;
  exports.halt = function() {
    halted = true;
  };

  // Start PhantomJS process.
  exports.spawn = function(pageUrl, options) {
    // Create temporary file to be used for grunt-phantom communication.
    var tempfile = new Tempfile();
    // Timeout ID.
    var id;
    // The number of tempfile lines already read.
    var n = 0;
    // Reset halted flag.
    halted = null;

    // All done? Clean up!
    var cleanup = function() {
      clearTimeout(id);
      tempfile.unlink();
    };

    // Internal methods.
    var privates = {
      // Abort if PhantomJS version isn't adequate.
      version: function(version) {
        var current = [version.major, version.minor, version.patch].join('.');
        var required = '>= 1.6.0';
        if (!semver.satisfies(current, required)) {
          exports.halt();
          grunt.log.writeln();
          grunt.log.errorlns(
            'In order for this task to work properly, PhantomJS version ' +
            required + ' must be installed, but version ' + current +
            ' was detected.'
          );
          grunt.warn('The correct version of PhantomJS needs to be installed.', 127);
        }
      }
    };

    // It's simple. As the page running in PhantomJS alerts messages, they
    // are written as JSON to a temporary file. This polling loop checks that
    // file for new lines, and for each one parses its JSON and emits the
    // corresponding event with the specified arguments.
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
        var eventName = args[0];
        // Debugging messages.
        grunt.log.debug(JSON.stringify(['phantomjs'].concat(args)).magenta);
        if (eventName === 'private') {
          // If a private (internal) message is passed, execute the
          // corresponding method.
          privates[args[1]].apply(null, args.slice(2));
        } else {
          // Otherwise, emit the event with its arguments.
          exports.emit.apply(exports, args);
        }
        // If halted, return true. Because the Array#some method was used,
        // this not only sets "done" to true, but stops further iteration
        // from occurring.
        return halted;
      });

      if (done) {
        // All done.
        cleanup();
        options.done(null);
      } else {
        // Update n so previously processed lines are ignored.
        n = lines.length;
        // Check back in a little bit.
        id = setTimeout(loopy, 100);
      }
    }());

    // Process options.
    var failCode = options.failCode || 0;

    // Build an array of optional PhantomJS --args, deleting those keys from
    // the options object.
    var args = [];
    Object.keys(options.options).forEach(function(key) {
      if (/^\-\-/.test(key)) {
        args.push(key + '=' + options.options[key]);
        delete options.options[key];
      }
    });

    // Keep -- PhantomJS flags first, followed by grunt-specific args.
    args.push(
      // The main PhantomJS script file.
      grunt.task.getFile('lib/phantomjs/bootstrap.js'),
      // The temporary file used for communications.
      tempfile.path,
      // URL or path to the page .html test file to run.
      pageUrl,
      // Additional PhantomJS options.
      JSON.stringify(options.options)
    );

    grunt.log.debug(JSON.stringify(args));

    // Actually spawn PhantomJS.
    return grunt.util.spawn({
      cmd: 'phantomjs',
      args: args
    }, function(err, result, code) {
      if (!err) { return; }
      // Something went horribly wrong.
      cleanup();
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
        grunt.warn('PhantomJS not found.', failCode);
      } else {
        String(result).split('\n').forEach(grunt.log.error, grunt.log);
        grunt.warn('PhantomJS exited unexpectedly with exit code ' + code + '.', failCode);
      }
      options.done(code);
    });
  };

  return exports;
};
