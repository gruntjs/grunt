var handlebars = require('handlebars');
var dateformat = require('dateformat');

// ============================================================================
// HELPERS
// ============================================================================

// Get a config property. Most useful as a directive like <config:foo.bar>.
task.registerHelper('config', function(prop) {
  return config(prop);
});

// Return the given source coude with any leading banner comment stripped.
task.registerHelper('strip_banner', function(src) {
  return src.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
});

// Get a source file's contents with any leading banner comment stripped.
task.registerHelper('file_strip_banner', function(filepath) {
  return task.helper('strip_banner', file.read(filepath));
});

// Generate banner from template.
task.registerHelper('banner', function(prop) {
  if (!prop) { prop = 'meta.banner'; }
  var banner;
  if (config(prop)) {
    verbose.write('Generating banner...');
    try {
      // Compile and run template, passing in config object as the data source.
      banner = handlebars.compile(config(prop))(config()) + '\n';
      verbose.ok();
    } catch(e) {
      banner = '';
      verbose.error();
      log.error(e.message);
      fail.warn('Handlebars found errors.');
    }
  } else {
    fail.warn('No "' + prop + '" banner template defined.');
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
