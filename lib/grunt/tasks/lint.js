var jshint = require('jshint').JSHINT;

var log = grequire('log');
var verbose = log.verbose;

var file = grequire('file');
var fail = grequire('fail');

var task = grequire('task');

task.registerTask('lint', 'Validate code with JSHint.', function() {
  var errors = fail.errors;

  // Enable debugging if requested.
  if (__options.debug) {
    __build.jshint.devel = true;
    __build.jshint.debug = true;
  }

  // Display flags.
  this.helper('verboseflags', __build.jshint);

  // If pre-lint enabled, lint each individual file.
  if (__build.lint.pre) {
    __build.build.src.forEach(function(filepath) {
      this.helper('lint', file.read(filepath), filepath);
    }.bind(this));
  }

  // If post-lint enabled, lint the concatenated source.
  if (__build.lint.post) {
    this.helper('lint', this.helper('concat', __build.build.src), 'concatenated source');
  }

  // Status messages.
  if (fail.errors > errors) {
    fail.warn('JSHint found errors.');
  } else {
    log.writeln('Lint free.');
  }
});

// Lint source code with JSHint.
task.registerHelper('lint', function(src, extraMsg) {
  var msg = 'Linting' + (extraMsg ? ' ' + extraMsg : '') + '...';
  verbose.indent().write(msg);
  if (jshint(src, __build.jshint)) {
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
