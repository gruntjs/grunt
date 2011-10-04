var jshint = require('jshint').JSHINT;

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('lint', 'Validate code with JSHint.', function() {
  var errors = fail.errors;

  // Fail if any required config properties have been omitted.
  if (!config.needs('lint', 'build.src')) { return; }
  
  // Enable debugging if requested.
  if (option('debug')) {
    config.set('jshint.devel', true);
    config.set('jshint.debug', true);
  }

  // Display flags.
  verbose.writeflags(config('jshint'));

  // If pre-lint enabled, lint each individual file.
  if (config('lint.pre')) {
    config('build.src').forEach(function(filepath) {
      this.helper('lint', file.read(filepath), filepath);
    }.bind(this));
  }

  // If post-lint enabled, lint the concatenated source.
  if (config('lint.post')) {
    this.helper('lint', this.helper('concat', config('build.src')), 'concatenated source');
  }

  // Status messages.
  if (fail.errors > errors) {
    fail.warn('JSHint found errors.');
  } else {
    log.writeln('Lint free.');
  }
});

// var task = grequire('task');
// 
// task.registerTask('lint', 'OVERRIDE', function() {
//   console.log('LINTING START');
//   this.prop = 123;
//   this.super(456);
//   console.log('LINTING FINISH');
// });

// ============================================================================
// HELPERS
// ============================================================================

// Lint source code with JSHint.
task.registerHelper('lint', function(src, extraMsg) {
  var msg = 'Linting' + (extraMsg ? ' ' + extraMsg : '') + '...';
  verbose.indent().write(msg);
  if (jshint(src, config('jshint'))) {
    // Success!
    verbose.ok();
  } else {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().indent(function() {
      jshint.errors.forEach(function(e) {
        if (!e) { return; }
        var str = e.evidence ? e.evidence.inverse + ' <- ' : '';
        log.error('[L' + e.line + ':C' + e.character + '] ' + str + e.reason);
      });
    });
  }
  verbose.unindent();
});
