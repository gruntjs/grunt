var jshint = require('jshint').JSHINT;

var log = grequire('log');
var verbose = log.verbose;

var file = grequire('file');
var fail = grequire('fail');

var errors;

var task = grequire('task');

task.addTask('lint', 'Validate code with JSHint.', function() {
  errors = 0;

  // Display flags.
  verbose.writeln('Flags: ' + Object.keys(__build.jshint).map(function(key) {
    var val = __build.jshint[key];
    return key + (val === true ? '' : '=' + JSON.stringify(val));
  }).join(', '));

  // Concat files.
  var concat = __build.build.src.map(function(filepath) {
    // Read file source.
    var src = file.read(filepath);
    // If pre-lint enabled, lint.
    if (__build.lint.pre) {
      this.helper('lint', src, filepath);
    }
    return src;
  }).join('\n');

  // If post-lint enabled, lint the concatenated source.
  if (__build.lint.post) {
    verbose.write('Concatenating files...').ok();
    this.helper('lint', concat, 'concatenated source'));
  }

  // Status messages.
  if (errors > 0) {
    fail.warn('JSHint found errors.');
  } else {
    log.writeln('Lint free.');
  }
});

// Debugging lit subtask.
task.addTask('lint:d', 'Validate code with JSHint, with debugging enabled.', function() {
  this.task('debug').task('lint');
});

// Lint source code with JSHint.
task.addHelper('lint', function(src, extraMsg) {
  var msg = 'Linting' + (extraMsg ? ' ' + extraMsg : '') + '...';
  verbose.indent().write(msg);
  if (jshint(src, __build.jshint)) {
    // Success!
    verbose.ok();
  } else {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().indent(function() {
      errors++;
      jshint.errors.forEach(function(e) {
        if (!e) { return; }
        var str = e.evidence ? e.evidence.inverse + ' <- ' : '';
        log.error('[L' + e.line + ':C' + e.character + '] ' + str + e.reason);
      });
    });
  }
  verbose.unindent();
});
