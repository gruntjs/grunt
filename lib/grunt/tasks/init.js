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
var async = require('async');
var spawn = require('child_process').spawn;

var prompt = require('prompt');
prompt.message = '[' + '?'.green + ']';
prompt.delimiter = ' ';

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
task.registerHelper('prompt', function(properties, done) {
  properties.push({
    message: 'Are these answers correct?',
    name: 'ANSWERS_VALID',
    default: 'Y/n'
  });

  (function ask() {
    async.map(properties, function(property, done) {
      if (typeof property.default === 'function') {
        property.default(function(err, value) {
          property.default = err ? '???' : value;
          done(null, property);
        });
      } else {
        done(null, property);
      }
    }, function(err, result) {
      log.subhead('Please answer the following:');
      prompt.start();
      prompt.get(result, function(err, result) {
        if (/y/i.test(result.ANSWERS_VALID)) {
          prompt.pause();
          delete result.ANSWERS_VALID;
          done(err, result);
        } else {
          properties.slice(0, -1).forEach(function(property) {
            property.default = result[property.name];
          });
          ask();
        }
      });
    });
  }());
});

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
    } else if (opts.fallback) {
      done(null, opts.fallback);
    } else {
      done(errors.join('').replace(/\s+$/, ''));
    }
  });
});
