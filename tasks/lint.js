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

  // External libs.
  var jshint = require('jshint').JSHINT;

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('lint', 'Validate files with JSHint.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      options: {},
      globals: {},
      jshintrc: null
    });

    // If a jshintrc file was specified, read it.
    var jshintrc;
    if (options.jshintrc) {
      jshintrc = grunt.file.readJSON(options.jshintrc);
      delete options.jshintrc;
      // JSHint options and globals will be read from jshintrc file.
      options.options = jshintrc;
      options.globals = {};
      if (jshintrc.predef) {
        // Temp kluge for https://github.com/jshint/node-jshint/issues/104
        jshintrc.predef.forEach(function(key) {
          options.globals[key] = true;
        });
        delete jshintrc.predef;
      }
    }

    grunt.verbose.writeflags(options.options, 'JSHint options');
    grunt.verbose.writeflags(options.globals, 'JSHint globals');

    // Lint specified files.
    var files = grunt.file.expandFiles(this.file.src);
    files.forEach(function(filepath) {
      grunt.helper('lint', grunt.file.read(filepath), options.options,
        options.globals, filepath);
    });

    // Fail task if errors were logged.
    if (this.errorCount) { return false; }

    // Otherwise, print a success message.
    grunt.log.ok(files.length + ' files lint free.');
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  // No idea why JSHint treats tabs as options.indent # characters wide, but it
  // does. See issue: https://github.com/jshint/jshint/issues/430
  function getTabStr(options) {
    // Do something that's going to error.
    jshint('\tx', options || {});
    // If an error occurred, figure out what character JSHint reported and
    // subtract one.
    var character = jshint.errors && jshint.errors[0] && jshint.errors[0].character - 1;
    // If character is actually a number, use it. Otherwise use 1.
    var tabsize = isNaN(character) ? 1 : character;
    // If tabsize > 1, return something that should be safe to use as a
    // placeholder. \uFFFF repeated 2+ times.
    return tabsize > 1 && grunt.util.repeat(tabsize, '\uFFFF');
  }

  var tabregex = /\t/g;

  // Lint source code with JSHint.
  grunt.registerHelper('lint', function(src, options, globals, extraMsg) {
    // JSHint sometimes modifies objects you pass in, so clone them.
    options = grunt.util._.clone(options);
    globals = grunt.util._.clone(globals);
    // Enable/disable debugging if option explicitly set.
    if (grunt.option('debug') !== undefined) {
      options.devel = options.debug = grunt.option('debug');
      // Tweak a few things.
      if (grunt.option('debug')) {
        options.maxerr = Infinity;
      }
    }
    var msg = 'Linting' + (extraMsg ? ' ' + extraMsg : '') + '...';
    grunt.verbose.write(msg);
    // Tab size as reported by JSHint.
    var tabstr = getTabStr(options);
    var placeholderregex = new RegExp(tabstr, 'g');
    // Lint.
    var result = jshint(src, options || {}, globals || {});
    var data = jshint.data();
    // Attempt to work around JSHint erroneously reporting bugs.
    // if (!result) {
    //   // Filter out errors that shouldn't be reported.
    //   jshint.errors = jshint.errors.filter(function(o) {
    //     return o && o.something === 'something';
    //   });
    //   // If no errors are left, JSHint actually succeeded.
    //   result = jshint.errors.length === 0;
    // }
    if (result && !data.unused) {
      // Success!
      grunt.verbose.ok();
      return;
    }
    // Something went wrong.
    grunt.verbose.or.write(msg);
    grunt.log.error();
    // Iterate over all unused variables
    var varsByLine = {};
    if (data.unused) {
      data.unused.forEach(function(unused) {
        var line = unused.line;
        var vars = varsByLine[line] = varsByLine[line] || [];
        vars.push(unused.name);
      });
      Object.keys(varsByLine).forEach(function(line) {
        // Manually increment errorcount since we're not using grunt.log.error().
        grunt.fail.errorcount++;
        var vars = varsByLine[line];
        grunt.log.writeln('['.red + ('L' + line).yellow + ']'.red +
          (' Unused variable' + (vars.length === 1 ? '' : 's') + ': ').yellow +
          grunt.log.wordlist(vars, {color: false, separator: ', '.yellow}));
      });
    }
    // Iterate over all errors.
    jshint.errors.forEach(function(e) {
      // Sometimes there's no error object.
      if (!e) { return; }
      var pos;
      var evidence = e.evidence;
      var character = e.character;
      if (evidence) {
        // Manually increment errorcount since we're not using grunt.log.error().
        grunt.fail.errorcount++;
        // Descriptive code error.
        pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + character).yellow + ']'.red;
        grunt.log.writeln(pos + ' ' + e.reason.yellow);
        // If necessary, eplace each tab char with something that can be
        // swapped out later.
        if (tabstr) {
          evidence = evidence.replace(tabregex, tabstr);
        }
        if (character === 0) {
          // Beginning of line.
          evidence = '?'.inverse.red + evidence;
        } else if (character > evidence.length) {
          // End of line.
          evidence = evidence + ' '.inverse.red;
        } else {
          // Middle of line.
          evidence = evidence.slice(0, character - 1) + evidence[character - 1].inverse.red +
            evidence.slice(character);
        }
        // Replace tab placeholder (or tabs) but with a 2-space soft tab.
        evidence = evidence.replace(tabstr ? placeholderregex : tabregex, '  ');
        grunt.log.writeln(evidence);
      } else {
        // Generic "Whoops, too many errors" error.
        grunt.log.error(e.reason);
      }
    });
    grunt.log.writeln();
  });

};
