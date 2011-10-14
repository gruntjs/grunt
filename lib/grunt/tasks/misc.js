var handlebars = require('handlebars');
var dateformat = require('dateformat');

// ============================================================================
// HELPERS
// ============================================================================

// Used to run a helper associated with a directive.
task.registerHelper('directive', function(dir) {
  // If str is a directive, strip off the surrounding <>.
  dir = config.getDirective(dir) || dir;
  // Split directive into arguments.
  var args = dir.split(':');
  // If the helper exists, pass all args in and return its value, otherwise
  // return null.
  return task._helpers[args[0]] ? task.helper.apply(task, args) : null;
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
