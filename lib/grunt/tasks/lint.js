var jshint = require('jshint').JSHINT;

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('lint', 'Validate files with JSHint. Use "lint" to ' +
  'validate all files defined in "lint: {}" sub-properties, or use ' +
  '"lint:foo" fo lint only files defined in the "lint: {foo: [...]}" ' +
  'property.', function(name) {
  if (!name) {
    // No lint property name passed, iterate over all lint config properties.
    Object.keys(config('lint')).forEach(function(name) {
      task.run('lint:' + name);
    });
    return;
  }

  // Fail if any required config properties have been omitted.
  if (!config.needs('lint.' + name)) { return; }

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

  // Status messages.
  if (fail.errors > errorCount) {
    return false;
  } else {
    log.writeln('Lint free.');
  }
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
  // Lint.
  var msg = 'Linting' + (extraMsg ? ' ' + extraMsg : '') + '...';
  verbose.write(msg);
  if (jshint(src, options || {}, globals || {})) {
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
