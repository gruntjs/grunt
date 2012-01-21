/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var spawn = require('child_process').spawn;
var handlebars = require('handlebars');

// ============================================================================
// HELPERS
// ============================================================================

// Get a config property. Most useful as a directive like <config:foo.bar>.
task.registerHelper('config', config);

// Read a JSON file. Most useful as a directive like <json:package.json>.
task.registerHelper('json', file.readJson.bind(file));

// Spawn a child process, capturing its stdout and stderr.
task.registerHelper('child_process', function(opts, done) {
  var child = spawn(opts.cmd, opts.args, opts.opts);
  var results = [];
  var errors = [];
  child.stdout.on('data', results.push.bind(results));
  child.stderr.on('data', errors.push.bind(errors));
  child.on('exit', function(code) {
    if (code === 0) {
      done(null, results.join('').replace(/\s+$/, ''));
    } else if ('fallback' in opts) {
      done(null, opts.fallback);
    } else {
      done(errors.join('').replace(/\s+$/, ''));
    }
  });
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
  var banner, obj;
  var template = config(prop);
  if (template) {
    // Read config object first, to ensure that verbose-mode JSON reading via
    // <json> directive doesn't interrupt future logging.
    obj = config();
    // Now, log.
    verbose.write('Generating banner...');
    try {
      // Compile and run template, passing in config object as the data source.
      banner = handlebars.compile(template)(obj) + '\n';
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
