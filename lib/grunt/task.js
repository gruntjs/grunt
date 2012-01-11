/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var path = require('path');
var fs = require('fs');

// An internal registry of tasks and handlers.
var registry = {};

// Extend generic "task" util lib.
var parent = urequire('task').create();
exports = module.exports = Object.create(parent);

// If any log.error() calls occurred, then the task had errors.
var errorcount;
exports.hadErrors = function() {
  return fail.errorcount > errorcount;
};

// Override built-in registerTask.
exports.registerTask = function(name, info, fn) {
  // Add task to registry.
  registry.tasks.push(name);
  // Register task.
  parent.registerTask.apply(this, arguments);
  // This task, now that it's been registered.
  var task = this._tasks[name];
  // Override task function.
  var _fn = task.fn;
  task.fn = function() {
    // Initialize the errorcount for this task.
    errorcount = fail.errorcount;
    // If this task was an alias or a basic task called without arguments,
    // only log if in verbose mode.
    var logger = _fn.alias || (task.basic && arguments.length === 0) ? verbose : log;
    // Actually log.
    logger.header('Running "' + this.nameArgs + '"' +
      (this.name !== this.nameArgs ? ' (' + this.name + ')' : '') + ' task');
    // Actually run the task.
    return _fn.apply(this, arguments);
  };
  return this;
};

// This is the most common "basic task" pattern.
exports.registerBasicTask = function(name, info, fn) {
  exports.registerTask(name, info, function(prop) {
    // If an argument wasn't specified, run this task once for each config sub-prop.
    if (!prop) {
      return task.runAllProps(name);
    }
    // Fail if any required config properties have been omitted.
    config.requires([name, prop]);
    // Call original task function, passing in only the stuff you really care about.
    return fn.call(this, config([name, prop]), prop);
  });
  this._tasks[name].basic = true;
};

// Override built-in registerHelper to use the registry.
exports.registerHelper = function(name, fn) {
  // Add task to registry.
  registry.helpers.push(name);
  // Actually register task.
  return parent.registerHelper.apply(this, arguments);
};

// If a property wasn't passed, run all sub-property sub-tasks in turn. If the
// `configname` argument is omitted, use `taskname` for both.
exports.runAllProps = function(taskname, configname) {
  if (!configname) { configname = taskname; }
  // Get an array of sub-property keys under the given config object.
  var props = Object.keys(config(configname) || {});
  // Fail if there are no actual properties to iterate over.
  if (props.length === 0) {
    log.error('No "' + configname + '" configuration properties found.');
    return false;
  }
  // Iterate over all properties, running a task for each.
  props.forEach(function(prop) { task.run(taskname + ':' + prop); });
};

// Load tasks and handlers from a given tasks file.
function loadTask(filepath, info) {
  registry.tasks = [];
  registry.helpers = [];
  var file = path.basename(filepath);
  var msg = 'Loading ' + info + ' "' + file + '" tasks and helpers...';
  verbose.write(msg);
  try {
    // Load taskfile.
    require(path.resolve(filepath));
    verbose.ok();
    if (registry.tasks.length === 0 && registry.helpers.length === 0) {
      verbose.error('No tasks or helpers defined.');
    } else {
      if (registry.tasks.length > 0) {
        verbose.writeln('Tasks: ' + log.wordlist(registry.tasks));
      }
      if (registry.helpers.length > 0) {
        verbose.writeln('Helpers: ' + log.wordlist(registry.helpers));
      }
    }
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().error(e.message);
  }
}

// Initialize tasks.
exports.init = function(nofatal) {
  var tasks = option('tasks') ? option('tasks').slice() : [];
  // Prepend any user-specified tasks dirs with built-in tasks dir.
  tasks.unshift(path.join(__dirname, 'tasks'));
  // Load all built-in and user-specified tasks.
  tasks.forEach(function(tasksdir, i) {
    try {
      fs.readdirSync(tasksdir).filter(function(filename) {
        // Filter out non-.js files.
        return path.extname(filename).toLowerCase() === '.js';
      }).forEach(function(filename) {
        // Load task.
        loadTask(path.join(tasksdir, filename), i > 0 ? 'additional' : 'built-in');
      });
    } catch(e) {
      log.error(e.message);
    }
  });

  // Get any local config data or tasks that might exist.

  // Use --config override if specified.
  var configfile = option('config');
  // If --config wasn't specified, search the current directory or any parent
  // directory for a grunt.js file.
  if (!configfile) {
    configfile = file.findup(process.cwd(), 'grunt.js');
  }
  var basename = path.basename(configfile);

  if (path.existsSync(configfile)) {
    // Load local tasks, if the file exists.
    loadTask(configfile, 'config file');
    // Change working directory so that all paths are relative to the
    // configfile's location (or the --base option, if specified).
    process.chdir(option('base') || path.dirname(configfile));
  } else if (option('config')) {
    // If --config override was specified and it doesn't exist, complain.
    fail.fatal('Unable to find "' + configfile + '" config file.', 2);
  } else if (!option('help')) {
    fail.fatal('Unable to find "grunt.js" config file. Do you need any --help?', 2);
  }
};
