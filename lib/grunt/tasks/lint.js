/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var jshint = require('jshint').JSHINT;

// ============================================================================
// TASKS
// ============================================================================

task.registerBasicTask('lint', 'Validate files with JSHint.', function(data, name) {
  // Get flags and globals.
  var options = config('jshint.options');
  var globals = config('jshint.globals');

  // Display flags and globals.
  verbose.writeflags(options, 'Options');
  verbose.writeflags(globals, 'Globals');

  // Lint specified files.
  file.expand(data).forEach(function(filepath) {
    task.helper('lint', file.read(filepath), options, globals, filepath);
  });

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln('Lint free.');
});

// ============================================================================
// HELPERS
// ============================================================================

// Lint source code with JSHint.
task.registerHelper('lint', function(src, options, globals, extraMsg) {
  // JSHint sometimes modifies objects you pass in, so clone them.
  options = underscore.clone(options);
  globals = underscore.clone(globals);
  // Enable/disable debugging if option explicitly set.
  if (option('debug') !== undefined) {
    options.devel = options.debug = option('debug');
  }
  var msg = 'Linting' + (extraMsg ? ' ' + extraMsg : '') + '...';
  verbose.write(msg);
  // Lint.
  var result = jshint(src, options || {}, globals || {});
  // Attempt to work around JSHint erroneously reporting bugs.
  if (!result) {
    jshint.errors = jshint.errors.filter(function(o) {
      // This is not a bug: exports = module.exports = something
      // https://github.com/jshint/jshint/issues/289
      return o && !(o.reason === 'Read only.' && /\bexports\s*[=]/.test(o.evidence));
    });
    // If no errors are left, JSHint actually succeeded.
    result = jshint.errors.length === 0;
  }
  if (result) {
    // Success!
    verbose.ok();
  } else {
    // Something went wrong.
    verbose.or.write(msg);
    log.error();
    // Iterate over all errors.
    jshint.errors.forEach(function(e) {
      // Sometimes there's no error object.
      if (!e) { return; }
      var pos;
      if (e.evidence) {
        // Manually increment errorcount since we're not using log.error().
        fail.errorcount++;
        // Descriptive code error.
        pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + e.character).yellow + ']'.red;
        log.writeln(pos + ' ' + e.reason.yellow).writeln(e.evidence.inverse);
      } else {
        // Generic "Whoops, too many errors" error.
        log.error(e.reason);
      }
    });
    log.writeln();
  }
});
