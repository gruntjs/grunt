var uglifyjs = require('uglify-js');
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');
var handlebars = require('handlebars');
var dateformat = require('dateformat');

task.registerTask('build', 'Run the "build:max" and "build:min" tasks.', function() {
  this.task('build:max').task('build:min');
});

task.registerTask('build:max', 'Concatenate and write file.', function() {
  // Fail if any required build properties have been omitted.
  if (!this.needs('build')) { return; }

  var max;
  // Write "max" (unminified) file.
  if (__build.build.max) {
    max = this.helper('banner') + this.helper('concat', __build.build.src);
    try {
      file.write(__build.build.max, max);
      verbose.indent(function() {
        log.writeln('Uncompressed size: ' + String(max.length).yellow + ' bytes.');
      });
    } catch(e) {
      fail.warn(e.message);
    }
  } else {
    verbose.writeln('Note, no build "max" file defined.');
  }
});

task.registerTask('build:min', 'Concatenate, minify (UglifyJS) and write file.', function() {
  // Fail if any required build properties have been omitted.
  if (!this.needs('build')) { return; }

  var min;
  // Write minified file.
  if (__build.build.min) {
    // Minify.
    min = this.helper('banner') + this.helper('uglify', this.helper('concat', __build.build.src), __build.uglify);
    try {
      file.write(__build.build.min, min);
      verbose.indent(function() {
        var gzipSize = String(this.helper('gzip', min).length);
        log.writeln('Compressed size: ' + gzipSize.yellow + ' bytes gzipped (' + String(min.length).yellow + ' bytes minified).');
      }.bind(this));
    } catch(e) {
      fail.warn(e.message);
    }
  } else {
    verbose.writeln('Note, no build "min" file defined.');
  }
});

// Minify with UglifyJS.
// From https://github.com/mishoo/UglifyJS
task.registerHelper('uglify', function(src, opts) {
  var msg = 'Minifying with UglifyJS...';
  verbose.write(msg);
  var jsp = uglifyjs.parser;
  var pro = uglifyjs.uglify;
  var ast;
  try {
    ast = jsp.parse(src);
    ast = pro.ast_mangle(ast, opts.mangle || {});
    ast = pro.ast_squeeze(ast, opts.squeeze || {});
    src = pro.gen_code(ast, opts.codegen || {});
    // Success!
    verbose.ok();
    return src;
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().indent(function() {
      log.error('[L' + e.line + ':C' + e.col + '] ' + e.message + ' (position: ' + e.pos + ')');
    });
    fail.warn('UglifyJS found errors.');
  }
});

// Return deflated source.
task.registerHelper('gzip', function(src) {
  return zlib.deflate(new Buffer(src));
});

// Generate banner from template.
task.registerHelper('banner', function() {
  var banner;
  if (__build.build.banner) {
    verbose.write('Generating banner...');
    try {
      banner = handlebars.compile(__build.build.banner)(__build.meta) + '\n';
      verbose.ok()
    } catch(e) {
      banner = '';
      verbose.error().indent(function() {
        log.error(e.message);
      });
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
  return dateformat(new Date, format);
});

handlebars.registerHelper('join', function(items, separator) {
  return items.join(typeof separator === 'string' ? separator : ', ');
});

