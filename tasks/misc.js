/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// ============================================================================
// HELPERS
// ============================================================================

// Get a config property. Most useful as a directive like <config:foo.bar>.
task.registerHelper('config', config);

// Read a JSON file. Most useful as a directive like <json:package.json>.
var jsons = {};
task.registerHelper('json', function(filepath) {
  // Don't re-fetch if being called as a directive and JSON is already cached.
  if (!this.directive || !(filepath in jsons)) {
    jsons[filepath] = file.readJson(filepath);
  }
  return jsons[filepath];
});

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
  var tmpl = config(prop);
  if (tmpl) {
    // Now, log.
    verbose.write('Generating banner...');
    try {
      // Compile and run template, using config object as the data source.
      banner = template.process(tmpl) + utils.linefeed;
      verbose.ok();
    } catch(e) {
      banner = '';
      verbose.error();
      fail.warn(e, 11);
    }
  } else {
    fail.warn('No "' + prop + '" banner template defined.', 11);
    banner = '';
  }
  return banner;
});
