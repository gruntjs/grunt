var jshint = require('jshint').JSHINT;

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('lint', 'Validate with JSHint.', function() {
  // Run "lint:files" task if lint.files config is defined.
  if (config('lint.files')) {
    this.task('lint:files');
  }
  // Run "lint:built" task if build.max config is defined.
  if (config('build.max')) {
    this.task('lint:built');
  }
});

task.registerTask('lint:files', 'Validate files with JSHint.', function() {
  // Fail if any required config properties have been omitted.
  if (!config.needs('lint.files')) { return; }

  var errorCount = fail.errors;

  // Get flags and globals.
  var options = config('jshint.options');
  var globals = config('jshint.globals');

  // Display flags and globals.
  verbose.writeflags(options, 'Options');
  verbose.writeflags(globals, 'Globals');

  // Lint specified files.
  file.files(config('lint.files')).forEach(function(filepath) {
    this.helper('lint', file.read(filepath), options, globals, filepath);
  }.bind(this));

  // Status messages.
  if (fail.errors > errorCount) {
    fail.warn('JSHint found errors.');
  } else {
    log.writeln('Lint free.');
  }
});

task.registerTask('lint:built', 'Validate built file with JSHint.', function() {
  // Fail if any required config properties have been omitted.
  if (!config.needs('build.max')) { return; }

  var errorCount = fail.errors;

  // Get flags and globals.
  var options = config('jshint.options');
  var globals = config('jshint.globals');

  // Display flags and globals.
  verbose.writeflags(options, 'Options');
  verbose.writeflags(globals, 'Globals');

  // If post-lint enabled, lint the concatenated source.
  var filepath = config('build.max');
  this.helper('lint', file.read(filepath), options, globals, 'built ' + filepath);

  // Status messages.
  if (fail.errors > errorCount) {
    fail.warn('JSHint found errors.');
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
  verbose.indent().write(msg);
  if (jshint(src, options || {}, globals || {})) {
    // Success!
    verbose.ok();
  } else {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().indent(function() {
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
    }).writeln();
  }
  verbose.unindent();
});
