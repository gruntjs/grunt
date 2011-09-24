var uglifyjs = require('uglify-js');
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');

var log = grequire('log');
var verbose = log.verbose;

var file = grequire('file');
var fail = grequire('fail');

module.exports = {
  info: 'Minify code with Uglify-js.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    // Concat files.
    var concat = __build.build.src.map(function(filepath) {
      // Read file source.
      return file.read(filepath);
    }).join('\n');

    verbose.write('Concatenating files...').ok();
    // Minify.
    var min = uglify(concat);
    //console.log(min);
  },
  subtasks: {
    a: function() {
      log.writeln('min:a');
    },
    b: function() {
      log.writeln('min:b');
    }
  }
};

// Minify with UglifyJS.
// From https://github.com/mishoo/UglifyJS
function uglify(src) {
  var msg = 'Minifying with UglifyJS...';
  verbose.write(msg);
  var jsp = uglifyjs.parser;
  var pro = uglifyjs.uglify;
  var ast;
  try {
    ast = jsp.parse(src);
    ast = pro.ast_mangle(ast, __build.uglify.mangle || {});
    ast = pro.ast_squeeze(ast, __build.uglify.squeeze || {});
    src = pro.gen_code(ast, __build.uglify.codegen || {});
    // Success!
    verbose.ok();
    return src;
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().indent(function() {
      log.error('[L' + e.line + ':C' + e.col + '] ' + e.message + ' (position: ' + e.pos + ')');
    });
    fail.warn(e.message);
  }
}
