/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

// ============================================================================
// TASKS
// ============================================================================

task.registerInitTask('init', 'Initialize a project from a predefined template.', function(name) {
  // Path to init's extra files.
  var extras = extraspath('init');
  // Array of valid template names (.js files in the extras path).
  var templates = fs.readdirSync(extras).filter(function(filename) {
    return fs.statSync(path.join(extras, filename)).isFile() &&
      path.extname(filename) === '.js';
  }).map(function(filename) {
    return path.basename(filename, '.js');
  });

  // Abort if a valid template was not specified.
  if (!name || templates.indexOf(name) === -1) {
    fail.warn('A valid template name must be specified. Valid templates are "' +
      templates.join('", "') + '".');
  }

  // Abort if a gruntfile was found (to avoid accidentally nuking it).
  if (path.existsSync(path.join(process.cwd(), 'grunt.js'))) {
    fail.warn('Found grunt.js file, aborting.');
  }

  // This task is asynchronous.
  var taskDone = this.async();

  // Execute template code.
  require(path.join(extras, name))(function() {
    // Fail task if errors were logged.
    if (task.hadErrors()) { return false; }
    // Otherwise, print a success message.
    log.writeln('Initialized from template "' + name + '".');
    // All done!
    taskDone();
  });
});

// ============================================================================
// HELPERS
// ============================================================================

// Prompt user to override default values passed in obj.
task.registerHelper('prompt', function(obj, done) {
  var result = {};
  (function next(keys) {
    if (keys.length === 0) {
      done(result);
      return;
    }

    var key = keys.shift();
    var setNext = function(value) {
      result[key] = value;
      next(keys);
    };

    if (typeof obj[key] === 'function') {
      obj[key](setNext);
    } else {
      setNext(obj[key]);
    }
  }(Object.keys(obj)));
});

task.registerHelper('child_process', function(opts, done) {
  var child = spawn(opts.cmd, opts.args, opts.opts);
  var results = [];
  child.stdout.on('data', results.push.bind(results));
  child.on('exit', function(code) {
    done(code === 0 ? results.join('\n').replace(/\n$/, '') : opts.fallback);
  });
});
