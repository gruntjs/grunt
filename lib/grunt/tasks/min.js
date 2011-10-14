var uglifyjs = require('uglify-js');
var zlib = require('zlib');
var handlebars = require('handlebars');
var dateformat = require('dateformat');

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

  // Concat specified files.
  var errorcount = fail.errorcount;
  var files = file.expand(config(propname));
  var max = task.helper('concat', files);
  
  // Concat banner + minified source.
  var min = task.helper('banner') + task.helper('uglify', max, config('uglify'));
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
