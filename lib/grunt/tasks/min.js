var uglifyjs = require('uglify-js');
var zlib = require('zlib');

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('min', 'Minify files with UglifyJS.*', function(name) {
  if (!name) {
    // An argument wasn't passed. Run this task once for each concat sub-prop.
    return task.runAllProps('min');
  }

  // Any name with a possible "." has to be escaped!
  var propname = 'min.' + config.escape(name);

  // Fail if any required config properties have been omitted.
  config.requires(propname);

  var errorcount = fail.errorcount;
  var files = file.expand(config(propname));
  // Get banner, if specified. It would be nice if UglifyJS supported ignoring
  // all comments matching a certain pattern, like /*!...*/, but it doesn't.
  var banner = '';
  if (config.getDirective(files[0]) === 'banner') {
    files.shift();
    banner = task.helper('banner');
  }
  // Concat specified files. This should really be a single, pre-built (and
  // linted) file, but it supports any number of files.
  var max = task.helper('concat', files);
  
  // Concat banner + minified source.
  var min = banner + task.helper('uglify', max, config('uglify'));
  file.write(name, min);
  
  // Fail task if there were errors.
  if (fail.errorcount > errorcount) { return false; }

  // Otherwise, print a success message.
  log.writeln('File "' + name + '" created.');

  // Report some sizes.
  var gzipSize = String(task.helper('gzip', min).length);
  log.writeln('Uncompressed size: ' + String(max.length).green + ' bytes.');
  log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + String(min.length).green + ' bytes minified).');
});

// ============================================================================
// HELPERS
// ============================================================================

// Minify with UglifyJS.
// From https://github.com/mishoo/UglifyJS
task.registerHelper('uglify', function(src, options) {
  if (!options) { options = {}; }
  var jsp = uglifyjs.parser;
  var pro = uglifyjs.uglify;
  var ast, pos;
  var msg = 'Minifying with UglifyJS...';
  verbose.write(msg);
  try {
    ast = jsp.parse(src);
    ast = pro.ast_mangle(ast, options.mangle || {});
    ast = pro.ast_squeeze(ast, options.squeeze || {});
    src = pro.gen_code(ast, options.codegen || {});
    // Success!
    verbose.ok();
    return src;
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg);
    pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + e.col).yellow + ']'.red;
    log.error().writeln(pos + ' ' + (e.message + ' (position: ' + e.pos + ')').yellow);
    fail.warn('UglifyJS found errors.');
  }
});

// Return deflated source.
task.registerHelper('gzip', function(src) {
  return src ? zlib.deflate(new Buffer(src)) : '';
});

// Strip /*...*/ comments from source.
task.registerHelper('strip_comments', function(src) {
  return src.replace(/\/\*[\s\S]*?\*\/\n*/g, '\n');
});
