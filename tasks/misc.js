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
var jsons = {};
task.registerHelper('json', function(filepath) {
  // Don't re-fetch if being called as a directive and JSON is already cached.
  if (!this.directive || !(filepath in jsons)) {
    jsons[filepath] = file.readJson(filepath);
  }
  return jsons[filepath];
});

// Spawn a child process, capturing its stdout and stderr.
task.registerHelper('child_process', function(opts, done) {
  var child = spawn(opts.cmd, opts.args, opts.opts);
  var stdout = '';
  var stderr = '';
  child.stdout.on('data', function(buf) { stdout += buf; });
  child.stderr.on('data', function(buf) { stderr += buf; });
  child.on('exit', function(code) {
    // Remove trailing whitespace (newline)
    stdout = utils._.rtrim(stdout);
    stderr = utils._.rtrim(stderr);
    // To keep JSHint from complaining about using new String().
    var MyString = String;
    // Create a new string... with properties.
    var result = new MyString(code === 0 ? stdout : 'fallback' in opts ? opts.fallback : stderr);
    result.stdout = stdout;
    result.stderr = stderr;
    result.code = code;
    done(code === 0 || 'fallback' in opts ? null: code, result, code);
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
      banner = template.process(tmpl, obj) + utils.linefeed;
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
