/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var uglifyjs = require('uglify-js');
var gzip = require('gzip-js');

// ============================================================================
// TASKS
// ============================================================================

task.registerBasicTask('min', 'Minify files with UglifyJS.', function(data, name) {
  var files = file.expand(data);
  // Get banner, if specified. It would be nice if UglifyJS supported ignoring
  // all comments matching a certain pattern, like /*!...*/, but it doesn't.
  var banner = task.directive(files[0], function() { return null; });
  if (banner === null) {
    banner = '';
  } else {
    files.shift();
  }
  // Concat specified files. This should really be a single, pre-built (and
  // linted) file, but it supports any number of files.
  var max = task.helper('concat', files);

  // Concat banner + minified source.
  var min = banner + task.helper('uglify', max, config('uglify'));
  file.write(name, min);

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message....
  log.writeln('File "' + name + '" created.');
  // ...and report some size information.
  task.helper('min_max_info', min, max);
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
    fail.warn('UglifyJS found errors.', 10);
  }
});

// Return gzipped source.
task.registerHelper('gzip', function(src) {
  return src ? gzip.zip(src, {}) : '';
});

// Output some size info about a file.
task.registerHelper('min_max_info', function(min, max) {
  var gzipSize = String(task.helper('gzip', min).length);
  log.writeln('Uncompressed size: ' + String(max.length).green + ' bytes.');
  log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + String(min.length).green + ' bytes minified).');
});

// Strip /*...*/ comments from source.
task.registerHelper('strip_comments', function(src) {
  return src.replace(/\/\*[\s\S]*?\*\/\n*/g, '\n');
});
