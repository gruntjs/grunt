var jshint = require('jshint').JSHINT;

var log = grequire('log');
var verbose = log.verbose;
var file = grequire('file');
var fail = grequire('fail');

var errors = 0;

module.exports = {
  info: 'Validate code with JSHint.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    var concat = __build.build.src.map(function(filepath) {
      var src = file.read(filepath);
      if (__build.lint.pre) {
        lint(src);
      }
      return src;
    }).join('\n');
    
    if (__build.lint.post) {
      verbose.write('Concatenating files...').ok();
      lint(concat);
    }
    
    if (errors > 0) {
      fail.warn('JSHint found errors.');
    } else {
      log.write('Lint free!');
    }
    //console.log(concat);
  },
  subtasks: {}
};

// Lint source code with JSHint.
function lint(src) {
  verbose.indent().write('Validating with JSHint...');
  if (jshint(src, __build.jshint)) {
    verbose.ok();
  } else {
    verbose.error();
    errors++;
    jshint.errors.forEach(function(e) {
      if ( !e ) { return; }
      var str = e.evidence ? e.evidence.inverse + ' <- ' : '';
      log.error('[L' + e.line + ':C' + e.character + '] ' + str + e.reason);
    });
  }
  verbose.unindent();
}