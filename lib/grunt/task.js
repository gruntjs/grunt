/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var grunt = require('../grunt');

// Nodejs libs.
var path = require('path');
var fs = require('fs');

// Extend generic "task" utils lib.
var parent = grunt.utils.task.create();

// The module to be exported.
var task = module.exports = Object.create(parent);

// An internal registry of tasks and handlers.
var registry = {};

// If any log.error() calls occurred, then the task had errors.
var errorcount;
task.hadErrors = function() {
  return grunt.fail.errorcount > errorcount;
};

// Override built-in registerTask.
task.registerTask = function(name, info, fn) {
  // Add task to registry.
  registry.tasks.push(name);
  // Register task.
  parent.registerTask.apply(task, arguments);
  // This task, now that it's been registered.
  var thisTask = task._tasks[name];
  // Override task function.
  var _fn = thisTask.fn;
  thisTask.fn = function(arg) {
    // Make a list of task-related extras paths available.
    this.extraspaths = grunt.file.taskpaths.bind(grunt.file, this.name);
    // Initialize the errorcount for this task.
    errorcount = grunt.fail.errorcount;
    // If this task was an alias or a multi task called without a target,
    // only log if in verbose mode.
    var logger = _fn.alias || (thisTask.multi && (!arg || arg === '*')) ? 'verbose' : 'log';
    // Actually log.
    grunt[logger].header('Running "' + this.nameArgs + '"' +
      (this.name !== this.nameArgs ? ' (' + this.name + ')' : '') + ' task');
    // Actually run the task.
    return _fn.apply(this, arguments);
  };
  return task;
};

// This is the most common "multi task" pattern.
task.registerMultiTask = function(name, info, fn) {
  task.registerTask(name, info, function(target) {
    // If a target wasn't specified, run this task once for each target.
    if (!target || target === '*') {
      return task.runAllTargets(name, grunt.utils.toArray(arguments).slice(1));
    }
    // Fail if any required config properties have been omitted.
    grunt.config.requires([name, target]);
    // Expose data on `this` (as well as task.current).
    this.data = grunt.config([name, target]);
    // Expose file object on `this` (as well as task.current).
    this.file = {};
    // Handle data structured like either:
    //   'prop': [srcfiles]
    //   {prop: {src: [srcfiles], dest: 'destfile'}}.
    if (grunt.utils.kindOf(this.data) === 'object') {
      if ('src' in this.data) { this.file.src = this.data.src; }
      if ('dest' in this.data) { this.file.dest = this.data.dest; }
    } else {
      this.file.src = this.data;
      this.file.dest = target;
    }
    // Process src as a template (recursively, if necessary).
    if (this.file.src) {
      this.file.src = grunt.utils.recurse(this.file.src, function(src) {
        if (typeof src !== 'string') { return src; }
        return grunt.template.process(src);
      });
    }
    // Process dest as a template.
    if (this.file.dest) {
      this.file.dest = grunt.template.process(this.file.dest);
    }
    // Recreate flags object so that the target isn't set as a flag.
    var args = grunt.utils.toArray(arguments).slice(1);
    this.flags = {};
    args.forEach(function(arg) { this.flags[arg] = true; }, this);
    // Call original task function, passing in the target and any other args.
    return fn.apply(this, arguments);
  });
  task._tasks[name].multi = true;
};

// Init tasks don't require properties in config, and as such will preempt
// config loading errors.
task.registerInitTask = function(name, info, fn) {
  task.registerTask(name, info, fn);
  task._tasks[name].init = true;
};

// Override built-in registerHelper to use the registry.
task.registerHelper = function(name, fn) {
  // Add task to registry.
  registry.helpers.push(name);
  // Actually register task.
  return parent.registerHelper.apply(task, arguments);
};

// If a property wasn't passed, run all task targets in turn.
task.runAllTargets = function(taskname, args) {
  // Get an array of sub-property keys under the given config object.
  var targets = Object.keys(grunt.config(taskname) || {});
  // Fail if there are no actual properties to iterate over.
  if (targets.length === 0) {
    grunt.log.error('No "' + taskname + '" targets found.');
    return false;
  }
  // Iterate over all properties not starting with _, running a task for each.
  targets.filter(function(target) {
    return !/^_/.test(target);
  }).forEach(function(target) {
    // Be sure to pass in any additionally specified args.
    task.run([taskname, target].concat(args || []).join(':'));
  });
};

// Load tasks and handlers from a given tasks file.
var loadTaskStack = [];
function loadTask(filepath, info) {
  // In case this was called recursively, save registry for later.
  loadTaskStack.push({tasks: registry.tasks, helpers: registry.helpers});
  // Reset registry.
  registry.tasks = [];
  registry.helpers = [];
  var file = path.basename(filepath);
  var msg = 'Loading ' + info + ' "' + file + '" tasks and helpers...';
  var tasks, fn;
  try {
    // Load taskfile.
    tasks = require(path.resolve(filepath));
    fn = tasks.config || tasks.tasks;
    if (typeof fn === 'function') {
      fn.call(grunt, grunt);
    }
    grunt.verbose.write(msg).ok();
    if (registry.tasks.length === 0 && registry.helpers.length === 0) {
      grunt.verbose.error('No new tasks or helpers found.');
    } else {
      if (registry.tasks.length > 0) {
        grunt.verbose.writeln('Tasks: ' + grunt.log.wordlist(registry.tasks));
      }
      if (registry.helpers.length > 0) {
        grunt.verbose.writeln('Helpers: ' + grunt.log.wordlist(registry.helpers));
      }
    }
  } catch(e) {
    // Something went wrong.
    grunt.log.write(msg).error().error(e.message);
  }
  // Restore registry.
  var obj = loadTaskStack.pop() || {};
  registry.tasks = obj.tasks || [];
  registry.helpers = obj.helpers || [];
}

// Load tasks and handlers from a given directory.
function loadTasks(tasksdir, info) {
  try {
    fs.readdirSync(tasksdir).filter(function(filename) {
      // Filter out non-.js files.
      return path.extname(filename).toLowerCase() === '.js';
    }).forEach(function(filename) {
      // Load task.
      loadTask(path.join(tasksdir, filename), info);
    });
  } catch(e) {
    grunt.log.error(e.message);
  }
}

// Load tasks and handlers from a given directory.
task.loadTasks = function(tasksdir) {
  if (path.existsSync(tasksdir)) {
    loadTasks(tasksdir, '"' + tasksdir + '" directory');
  } else {
    grunt.log.error('Tasks directory "' + tasksdir + '" not found.');
  }
};

// Load tasks and handlers from a given Npm module. Note that if grunt is
// installed globally, this will load global Npm modules. If grunt is
// installed locally, this will load local Npm modules.
task.loadNpmTasks = function(name) {
  var taskspath = grunt.file.npmTaskpath(name);
  if (taskspath) {
    loadTasks(taskspath, '"' + name + '" npm module');
  } else {
    grunt.log.error('Npm module "' + name + '" not found. Is it installed?');
  }
};

// Initialize tasks.
task.init = function(tasks, nocomplain) {
  var taskpaths = grunt.file.taskpaths().reverse();
  var userTasks = taskpaths.slice(1);
  var builtinTasks = taskpaths[0];

  // Load all built-in tasks.
  loadTasks(builtinTasks, 'built-in');

  // Don't complain if all specified tasks are "init" tasks.
  nocomplain = nocomplain || tasks.every(function(name) {
    var obj = task._taskPlusArgs(name).task;
    return obj && obj.init;
  });

  // Get any local config data or tasks that might exist.

  // Use --config override if specified.
  var configfile = grunt.option('config');
  // If not specified, search the current directory or any parent directory.
  if (!configfile) {
    configfile = grunt.file.findup(process.cwd(), 'grunt.js');
  }
  var basename = path.basename(configfile);

  var msg = 'Reading "' + basename + '" config file...';
  if (path.existsSync(configfile)) {
    grunt.verbose.write(msg).ok();
    // Load local tasks, if the file exists.
    loadTask(configfile, 'config file');
    // Change working directory so that all paths are relative to the
    // configfile's location (or the --base option, if specified).
    process.chdir(grunt.option('base') || path.dirname(configfile));
  } else if (nocomplain) {
    // Don't complain about missing config file.
  } else if (grunt.option('config')) {
    // If --config override was specified and it doesn't exist, complain.
    grunt.log.write(msg).error();
    grunt.fail.fatal('Unable to find "' + configfile + '" config file.', 2);
  } else if (!grunt.option('help')) {
    grunt.verbose.write(msg).error();
    grunt.fail.fatal('Unable to find "grunt.js" config file. Do you need any --help?', 2);
  }

  // Load all user-specified tasks.
  // NOTE: THIS MAY BE GOING AWAY
  userTasks.forEach(function(tasksdir) {
    loadTasks(tasksdir, 'user-defined');
  });
};
