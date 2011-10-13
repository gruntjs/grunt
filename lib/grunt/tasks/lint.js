var jshint = require('jshint').JSHINT;

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('lint', 'Validate files with JSHint. Task "lint" will validate all files, while task "lint:foo" will validate all "foo" files.', function(name) {
  var props;
  if (!name) {
    // No lint property name passed.
    props = Object.keys(config('lint') || {});
    // Fail if there are no actual properties.
    if (props.length === 0) {
      log.error('No "lint" configuration properties found.');
      return false;
    }
    // Iterate over all lint config properties, running "lint:___" for each.
    props.forEach(function(name) { task.run('lint:' + name); });
    return;
  }

  // Fail if any required config properties have been omitted.
  config.requires('lint.' + name);

  var errorCount = fail.errors;

  // Get flags and globals.
  var options = config('jshint.options');
  var globals = config('jshint.globals');

  // Display flags and globals.
  verbose.writeflags(options, 'Options');
  verbose.writeflags(globals, 'Globals');

  // Lint specified files.
  file.expand(config('lint.' + name)).forEach(function(filepath) {
    task.helper('lint', file.read(filepath), options, globals, filepath);
  });

  // Fail task if there were errors.
  if (fail.errors > errorCount) { return false; }

  // Otherwise, print a success message.
  log.writeln('Lint free.');
});

// ============================================================================
// HELPERS
// ============================================================================

// Lint source code with JSHint.
task.registerHelper('lint', function(src, options, globals, extraMsg) {
  // Enable debugging if requested.
  if (option('debug')) {
    options.devel = options.debug = true;
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
      return !(o.reason === 'Read only.' && /\bexports\s*[=]/.test(o.evidence));
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
      if (!e) { return; }
      fail.errors++;
      var pos;
      if (e.evidence) {
        // Descriptive code error.
        pos = '['.red + ('L' + e.line) + ':'.red + ('C' + e.character) + ']'.red;
        log.writeln(pos + ' ' + e.reason).writeln(e.evidence.inverse);
      } else {
        // Generic "Whoops, too many errors" error.
        log.error(e.reason);
      }
    });
    log.writeln();
  }
});
