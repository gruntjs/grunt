var uglifyjs = require('uglify-js');
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');
var handlebars = require('handlebars');
var dateformat = require('dateformat');

var log = grequire('log');
var verbose = log.verbose;

var file = grequire('file');
var fail = grequire('fail');

module.exports = {
  info: 'Concatenate, minify (UglifyJS) and write files.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    // Pre-generate.
    banner();
    concat();
    // Run the "max" and "min" tasks.
    this.task(':max').task(':min');
  },
  subtasks: {
    min: function() {
      var min;
      // Write minified file.
      if (__build.build.min) {
        // Minify.
        min = banner() + uglify(concat(), __build.uglify);
        try {
          file.write(__build.build.min, min);
          verbose.indent(function() {
            var gzipSize = gzip(min).length + '';
            log.writeln('Compressed size: ' + gzipSize.yellow + ' bytes gzipped (' + (min.length + '').yellow + ' bytes minified).');
          });
        } catch(e) {
          fail.warn(e.message);
        }
      } else {
        verbose.writeln('Note, no build "min" file defined.');
      }
    },
    max: function() {
      var max;
      // Write "max" (unminified) file.
      if (__build.build.max) {
        max = banner() + concat();
        try {
          file.write(__build.build.max, max);
          verbose.indent(function() {
            log.writeln('Uncompressed size: ' + (max.length + '').yellow + ' bytes.');
          });
        } catch(e) {
          fail.warn(e.message);
        }
      } else {
        verbose.writeln('Note, no build "max" file defined.');
      }
    }
  }
};

// Minify with UglifyJS.
// From https://github.com/mishoo/UglifyJS
function uglify(src, opts) {
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
}

// Return deflated source.
function gzip(src) {
  return zlib.deflate(new Buffer(src));
}

// Concat files.
var concatCached;
function concat() {
  if (concatCached == null) {
    concatCached = __build.build.src.map(file.read).join('\n');
    // TODO: test somehow?
    verbose.write('Concatenating files...').ok();
  }
  return concatCached;
}

// Parse banner.
var bannerCached;
function banner() {
  var tmpl;
  if (bannerCached == null) {
    if (__build.build.banner) {
      verbose.write('Generating banner...');
      try {
        bannerCached = handlebars.compile(__build.build.banner)(__build.meta) + '\n';
        verbose.ok()
      } catch(e) {
        bannerCached = '';
        verbose.error().indent(function() {
          log.error(e.message);
        });
        fail.warn('Handlebars found errors.');
      }
    } else {
      verbose.writeln('Note, no build "banner" template defined.');
      bannerCached = '';
    }
  }
  return bannerCached;
}

// Banner helpers.
handlebars.registerHelper('today', function(format) {
  return dateformat(new Date, format);
});

handlebars.registerHelper('join', function(items, separator) {
  return items.join(typeof separator === 'string' ? separator : ', ');
});

