/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var spawn = require('child_process').spawn;

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
      done(null, results.join('').replace(/\s+$/, ''), code);
    } else if ('fallback' in opts) {
      done(null, opts.fallback, code);
    } else {
      done(code, errors.join('').replace(/\s+$/, ''), code);
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
  var tmpl = config(prop);
  if (tmpl) {
    // Read config object first, to ensure that verbose-mode JSON reading via
    // <json> directive doesn't interrupt logging.
    obj = config();
    // Now, log.
    verbose.write('Generating banner...');
    try {
      // Compile and run template, passing in config object as the data source.
      banner = template.process(tmpl, obj) + util.linefeed;
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
