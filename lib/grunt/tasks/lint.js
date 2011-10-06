var jshint = require('jshint').JSHINT;

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('lint', 'Validate code with JSHint.', function() {
  // Fail if any required config properties have been omitted.
  if (!config.needs('lint')) { return; }

  var errors = fail.errors;

  // Get flags and globals.
  var options = config('jshint.options');
  var globals = config('jshint.globals');

  // Display flags and globals.
  verbose.writeflags(options, 'Options');
  verbose.writeflags(globals, 'Globals');

  // If lint files specified, lint them all.
  if (config('lint.files')) {
    file.files(config('lint.files')).forEach(function(filepath) {
      this.helper('lint', file.read(filepath), options, globals, filepath);
    }.bind(this));
  }

  // If pre-lint enabled, lint each individual file.
  if (config('lint.pre') && config('build.src')) {
    config('build.src').forEach(function(filepath) {
      this.helper('lint', file.read(filepath), options, globals, filepath);
    }.bind(this));
  }

  // If post-lint enabled, lint the concatenated source.
  if (config('lint.post')) {
    this.helper('lint', this.helper('concat', config('build.src')), options, globals, 'concatenated source');
  }

  // Status messages.
  if (fail.errors > errors) {
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
