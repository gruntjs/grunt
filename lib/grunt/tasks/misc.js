var handlebars = require('handlebars');
var template = grequire('template');

// ============================================================================
// HELPERS
// ============================================================================

// Get a config property. Most useful as a directive like <config:foo.bar>.
task.registerHelper('config', config);

// Return the given source coude with any leading banner comment stripped.
task.registerHelper('strip_banner', template.stripBanner);

// Get a source file's contents with any leading banner comment stripped.
task.registerHelper('file_strip_banner', function(filepath) {
  return template.stripBanner(file.read(filepath));
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
      fail.warn('Handlebars found errors.', 11);
    }
  } else {
    fail.warn('No "' + prop + '" banner template defined.', 11);
    banner = '';
  }
  return banner;
});

// Banner helpers.
handlebars.registerHelper('today', template.formatToday);
handlebars.registerHelper('join', template.joinItems);
