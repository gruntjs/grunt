var uglifyjs = require('uglify-js');
var zlib = require('zlib');
var handlebars = require('handlebars');
var dateformat = require('dateformat');

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('build', 'Alias for "build:max build:min" tasks.', function() {
  // Run "build:max" task if build.max config is defined.
  if (config('build.max')) {
    task.run('build:max');
  }
  // Run "build:min" task if build.min config is defined.
  if (config('build.min')) {
    task.run('build:min');
  }
});

task.registerTask('build:max', 'Concatenate and write source.', function() {
  // Fail if any required config properties have been omitted.
  if (!config.needs('build.src')) { return; }
  // Write the file.
  var src = task.helper('concat', config('build.src'));
  task.helper('write_max', task.helper('strip_comments', src));
});

task.registerTask('build:min', 'Concatenate, minify and write source.', function() {
  // Fail if any required config properties have been omitted.
  if (!config.needs('build.src')) { return; }
  // Write the file.
  var src = task.helper('concat', config('build.src'));
  task.helper('write_min', src);
});

// ============================================================================
// HELPERS
// ============================================================================

// Write "max" (unminified) file.
task.registerHelper('write_max', function(src) {
  // Fail if any required config properties have been omitted.
  if (!config.needs('build.max')) { return; }
  // Prepend banner.
  src = task.helper('banner') + src;
  // Actually write (and report).
  try {
    file.write(config('build.max'), src);
    log.writeln('Uncompressed size: ' + String(src.length).yellow + ' bytes.');
  } catch(e) {
    fail.warn(e.message);
  }
});

// Write minified file.
task.registerHelper('write_min', function(src) {
  // Fail if any required config properties have been omitted.
  if (!config.needs('build.min')) { return; }
  // Prepend banner and uglify.
  src = task.helper('banner') + task.helper('uglify', src, config('uglify'));
  // Actually write (and report).
  try {
    file.write(config('build.min'), src);
    var gzipSize = String(task.helper('gzip', src).length);
    log.writeln('Compressed size: ' + gzipSize.yellow + ' bytes gzipped (' + String(src.length).yellow + ' bytes minified).');
  } catch(e) {
    fail.warn(e.message);
  }
});

// Minify with UglifyJS.
// From https://github.com/mishoo/UglifyJS
task.registerHelper('uglify', function(src, options) {
  var msg = 'Minifying with UglifyJS...';
  verbose.write(msg);
  var jsp = uglifyjs.parser;
  var pro = uglifyjs.uglify;
  var ast;
  options = options || {};
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
    log.error().error('[L' + e.line + ':C' + e.col + '] ' + e.message + ' (position: ' + e.pos + ')');
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

// Generate banner from template.
task.registerHelper('banner', function() {
  var banner;
  if (config('build.banner')) {
    verbose.write('Generating banner...');
    try {
      banner = handlebars.compile(config('build.banner'))(config('meta')) + '\n';
      verbose.ok();
    } catch(e) {
      banner = '';
      verbose.error();
      log.error(e.message);
      fail.warn('Handlebars found errors.');
    }
  } else {
    verbose.writeln('Note, no build "banner" template defined.');
    banner = '';
  }
  return banner;
});

// Banner helpers.
handlebars.registerHelper('today', function(format) {
  return dateformat(new Date(), format);
});

handlebars.registerHelper('join', function(items, separator) {
  return items.join(typeof separator === 'string' ? separator : ', ');
});
