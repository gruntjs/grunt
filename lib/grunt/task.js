/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var grunt = require('../grunt');

// Nodejs libs.
var path = require('path');

// Extend generic "task" util lib.
var parent = grunt.util.task.create();

// The module to be exported.
var task = module.exports = Object.create(parent);

// A temporary registry of tasks and metadata.
var registry = {tasks: [], untasks: [], meta: {}};

// The last specified tasks message.
var lastInfo;

// Number of levels of recursion when loading tasks in collections.
var loadTaskDepth = 0;

// Keep track of the number of log.error() calls.
var errorcount;

// Override built-in registerTask.
task.registerTask = function(name) {
  // Add task to registry.
  registry.tasks.push(name);
  // Register task.
  parent.registerTask.apply(task, arguments);
  // This task, now that it's been registered.
  var thisTask = task._tasks[name];
  // Metadata about the current task.
  thisTask.meta = grunt.util._.clone(registry.meta);
  // Override task function.
  var _fn = thisTask.fn;
  thisTask.fn = function(arg) {
    // Initialize the errorcount for this task.
    errorcount = grunt.fail.errorcount;
    // Return the number of errors logged during this task.
    Object.defineProperty(this, 'errorCount', {
      get: function() {
        return grunt.fail.errorcount - errorcount;
      }
    });
    // Expose task.requires on `this`.
    this.requires = task.requires.bind(task);
    // Expose config.requires on `this`.
    this.requiresConfig = grunt.config.requires;
    // Return an options object with the specified defaults overriden by task-
    // specific overrides, via the "options" property.
    this.options = function() {
      var args = [{}].concat(grunt.util.toArray(arguments)).concat([
        grunt.config([name, 'options'])
      ]);
      return grunt.util._.extend.apply(null, args);
    };
    // If this task was an alias or a multi task called without a target,
    // only log if in verbose mode.
    var logger = _fn.alias || (thisTask.multi && (!arg || arg === '*')) ? 'verbose' : 'log';
    // Actually log.
    grunt[logger].header('Running "' + this.nameArgs + '"' +
      (this.name !== this.nameArgs ? ' (' + this.name + ')' : '') + ' task');
    // If --debug was specified, log the path to this task's source file.
    grunt[logger].debug('Task source: ' + thisTask.meta.filepath);
    // Actually run the task.
    return _fn.apply(this, arguments);
  };
  return task;
};

// Multi task targets can't start with _ or be a reserved property (options).
function isValidMultiTaskTarget(target) {
  return !/^_|^options$/.test(target);
}

// Normalize multi task files.
task.normalizeMultiTaskFiles = function(data, target) {
  var prop, obj;
  var files = [];
  if (grunt.util.kindOf(data) === 'object') {
    if ('src' in data || 'dest' in data) {
      obj = {};
      for (prop in data) {
        if (prop !== 'options') {
          obj[prop] = data[prop];
        }
      }
      files.push(obj);
    } else if (grunt.util.kindOf(data.files) === 'object') {
      for (prop in data.files) {
        files.push({src: data.files[prop], dest: prop});
      }
    } else if (Array.isArray(data.files)) {
      data.files.forEach(function(obj) {
        var prop;
        if ('src' in obj || 'dest' in obj) {
          files.push(obj);
        } else {
          for (prop in obj) {
            files.push({src: obj[prop], dest: prop});
          }
        }
      });
    }
  } else {
    files.push({src: Array.isArray(data) ? data : [data], dest: target});
  }

  // If no files were specified, a single empty files object should be
  // returned so that the task function will still actually run.
  if (files.length === 0) {
    return [{}];
  }

  // Process each normalized file object as a template.
  files.forEach(function(obj) {
    if ('src' in obj) {
      // Expose the un-expanded (but normalized) src list as .srcRaw.
      obj.srcRaw = obj.src;
      // Process obj.srcRaw as a template (recursively, if necessary).
      obj.srcRaw = grunt.util.recurse(obj.srcRaw, function(src) {
        if (typeof src !== 'string') { return src; }
        return grunt.template.process(src);
      });
      // If obj.srcRaw is an array, flatten it. Otherwise, make it into an array.
      obj.srcRaw = Array.isArray(obj.srcRaw) ? grunt.util._.flatten(obj.srcRaw) : [obj.srcRaw];
      // Expose an expand-on-demand getter method as .src.
      Object.defineProperty(obj, 'src', {
        enumerable: true,
        get: function fn() {
          if (!('result' in fn)) {
            fn.result = grunt.file.expand(obj.srcRaw);
          }
          return fn.result;
        }
      });
    }

    if ('dest' in obj) {
      // Process dest as a template.
      obj.dest = grunt.template.process(obj.dest);
    }
  });

  return files;
};

// This is the most common "multi task" pattern.
task.registerMultiTask = function(name, info, fn) {
  // If optional "info" string is omitted, shuffle arguments a bit.
  if (fn == null) {
    fn = info;
    info = 'Custom multi task.';
  }
  // Store a reference to the task object, in case the task gets renamed.
  var thisTask;
  task.registerTask(name, info, function(target) {
    // Guaranteed to always be the actual task name.
    var name = thisTask.name;
    // Arguments (sans target) as an array.
    var args = grunt.util.toArray(arguments).slice(1);
    // If a target wasn't specified, run this task once for each target.
    if (!target || target === '*') {
      return task.runAllTargets(name, args);
    } else if (!isValidMultiTaskTarget(target)) {
      throw new Error('Invalid target "' + target + '" specified.');
    }
    // Fail if any required config properties have been omitted.
    this.requiresConfig([name, target]);
    // Target data.
    var data = grunt.config([name, target]);
    // Initialize the errorcount for this task.
    errorcount = grunt.fail.errorcount;
    // Normalize files object.
    var files = task.normalizeMultiTaskFiles(data, target);
    // For each file object, call original task function, passing in the
    // target and any other args.
    grunt.util.async.forEachSeries(files, function(fileObj, next) {
      var context = {};
      // Copy some properties over from the main task `this` object.
      [
        'nameArgs',
        'name',
        'args',
        'flags',
        'requiresConfig',
        'requires',
      ].forEach(function(key) {
        context[key] = this[key];
      }, this);
      // Return the number of errors logged during this task.
      Object.defineProperty(context, 'errorCount', {
        get: function() {
          return grunt.fail.errorcount - errorcount;
        }
      });
      // Return an options object with the specified defaults overriden by task-
      // and/or target-specific overrides, via the "options" property.
      context.options = function() {
        var targetObj = grunt.config([name, target]);
        var args = [{}].concat(grunt.util.toArray(arguments)).concat([
          grunt.config([name, 'options']),
          grunt.util.kindOf(targetObj) === 'object' ? targetObj.options : {}
        ]);
        return grunt.util._.extend.apply(null, args);
      };
      // Expose data on `context` (as well as task.current).
      context.data = data;
      // Expose the current target.
      context.target = target;
      // Expose file object.
      context.file = fileObj;

      // Actually run the task function (handling this.async, etc)
      task.runTaskFn(context, function() {
        return fn.apply(this, this.args);
      }, next);

    }.bind(this), this.async());
  });

  thisTask = task._tasks[name];
  thisTask.multi = true;
};

// Init tasks don't require properties in config, and as such will preempt
// config loading errors.
task.registerInitTask = function(name, info, fn) {
  task.registerTask(name, info, fn);
  task._tasks[name].init = true;
};

// Override built-in renameTask to use the registry.
task.renameTask = function(oldname, newname) {
  // Add and remove task.
  registry.untasks.push(oldname);
  registry.tasks.push(newname);
  // Actually rename task.
  return parent.renameTask.apply(task, arguments);
};

// Override built-in unregisterTask to use the registry.
task.unregisterTasks = function() {
  // Add tasks to "un" registry.
  task.parseArgs(arguments).forEach(function(name) {
    registry.untasks.push(name);
  });
  // Actually unregister tasks.
  return parent.unregisterTasks.apply(task, arguments);
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
  // Iterate over all valid target properties, running a task for each.
  targets.filter(isValidMultiTaskTarget).forEach(function(target) {
    // Be sure to pass in any additionally specified args.
    task.run([taskname, target].concat(args || []).join(':'));
  });
};

// Load tasks and handlers from a given tasks file.
var loadTaskStack = [];
function loadTask(filepath) {
  // In case this was called recursively, save registry for later.
  loadTaskStack.push(registry);
  // Reset registry.
  registry = {tasks: [], untasks: [], meta: {info: lastInfo, filepath: filepath}};
  var filename = path.basename(filepath);
  var msg = 'Loading "' + filename + '" tasks...';
  var regCount = 0;
  var fn;
  try {
    // Load taskfile.
    fn = require(path.resolve(filepath));
    if (typeof fn === 'function') {
      fn.call(grunt, grunt);
    }
    grunt.verbose.write(msg).ok();
    // Log registered/renamed/unregistered tasks.
    ['un', ''].forEach(function(prefix) {
      var list = grunt.util._.chain(registry[prefix + 'tasks']).uniq().sort().value();
      if (list.length > 0) {
        regCount++;
        grunt.verbose.writeln((prefix ? '- ' : '+ ') + grunt.log.wordlist(list));
      }
    });
    if (regCount === 0) {
      grunt.verbose.error('No tasks were registered or unregistered.');
    }
  } catch(e) {
    // Something went wrong.
    grunt.log.write(msg).error().verbose.error(e.stack).or.error(e);
  }
  // Restore registry.
  registry = loadTaskStack.pop() || {};
}

// Log a message when loading tasks.
function loadTasksMessage(info) {
  // Only keep track of names of top-level loaded tasks and collections,
  // not sub-tasks.
  if (loadTaskDepth === 0) { lastInfo = info; }
  grunt.verbose.subhead('Registering ' + info + ' tasks.');
}

// Load tasks and handlers from a given directory.
function loadTasks(tasksdir) {
  try {
    var files = grunt.file.glob.sync('*.{js,coffee}', {cwd: tasksdir, maxDepth: 1});
    // Load tasks from files.
    files.forEach(function(filename) {
      loadTask(path.join(tasksdir, filename));
    });
  } catch(e) {
    grunt.log.verbose.error(e.stack).or.error(e);
  }
}

// Directories to be searched for tasks files and "extra" files.
task.searchDirs = [];

// Return an array of all task-specific file paths that match the given
// wildcard patterns. Instead of returing a string for each file path, return
// an object with useful properties. When coerced to String, each object will
// yield its absolute path.
function expandByMethod(method) {
  var args = grunt.util.toArray(arguments).slice(1);
  // If the first argument is an options object, remove and save it for later.
  var options = grunt.util.kindOf(args[0]) === 'object' ? args.shift() : {};
  // Use the first argument if it's an Array, otherwise convert the arguments
  // object to an array and use that.
  var patterns = Array.isArray(args[0]) ? args[0] : args;
  var filepaths = {};
  // When any returned array item is used in a string context, return the
  // absolute path.
  var toString = function() { return this.abs; };
  // Iterate over all searchDirs.
  task.searchDirs.forEach(function(dirpath) {
    var opts = Object.create(options);
    // Set the cwd so the grunt.file.expand* method can match relatively.
    opts.cwd = dirpath;
    // Create an array of absolute patterns, preceded by the options object.
    var args = [opts].concat(patterns);
    // Expand the paths in case a wildcard was passed.
    grunt.file[method].apply(null, args).forEach(function(relpath) {
      if (relpath in filepaths) { return; }
      // Update object at this relpath only if it doesn't already exist.
      filepaths[relpath] = {
        abs: dirpath + '/' + relpath,
        rel: relpath,
        base: dirpath,
        toString: toString
      };
    });
  });
  // Return an array of objects.
  return Object.keys(filepaths).map(function(relpath) {
    return filepaths[relpath];
  });
}

// A few type-specific task expansion methods. These methods all return arrays
// of file objects.
task.expand = expandByMethod.bind(task, 'expand');
task.expandDirs = expandByMethod.bind(task, 'expandDirs');
task.expandFiles = expandByMethod.bind(task, 'expandFiles');

// Get a single task file path.
task.getFile = function() {
  var filepath = path.join.apply(path, arguments);
  var fileobj = task.expand(filepath)[0];
  return fileobj ? String(fileobj) : null;
};

// Read JSON defaults from task files (if they exist), merging them into one.
// data object.
var readDefaults = {};
task.readDefaults = function() {
  var filepath = path.join.apply(path, arguments);
  var result = readDefaults[filepath];
  var filepaths;
  if (!result) {
    result = readDefaults[filepath] = {};
    // Find all matching taskfiles.
    filepaths = task.searchDirs.map(function(dirpath) {
      return path.join(dirpath, filepath);
    }).filter(function(filepath) {
      return grunt.file.isFile(filepath);
    });
    // Load defaults data.
    if (filepaths.length) {
      grunt.verbose.subhead('Loading data from ' + filepath);
      // Since extras path order goes from most-specific to least-specific, only
      // add-in properties that don't already exist.
      filepaths.forEach(function(filepath) {
        grunt.util._.defaults(result, grunt.file.readJSON(filepath));
      });
    }
  }
  return result;
};

// Load tasks and handlers from a given directory.
task.loadTasks = function(tasksdir) {
  loadTasksMessage('"' + tasksdir + '"');
  if (grunt.file.exists(tasksdir)) {
    task.searchDirs.unshift(tasksdir);
    loadTasks(tasksdir);
  } else {
    grunt.log.error('Tasks directory "' + tasksdir + '" not found.');
  }
};

// Load tasks and handlers from a given locally-installed Npm module (installed
// relative to the base dir).
task.loadNpmTasks = function(name) {
  loadTasksMessage('"' + name + '" local Npm module');
  var root = path.resolve('node_modules');
  var pkgfile = path.join(root, name, 'package.json');
  var pkg = grunt.file.exists(pkgfile) ? grunt.file.readJSON(pkgfile) : {keywords: []};

  // Process collection plugins.
  if (pkg.keywords.indexOf('gruntcollection') !== -1) {
    loadTaskDepth++;
    Object.keys(pkg.dependencies).forEach(function(depName) {
      // Npm sometimes pulls dependencies out if they're shared, so find
      // upwards if not found locally.
      var filepath = grunt.file.findup(path.resolve('node_modules', name),
        'node_modules/' + depName);
      if (filepath) {
        // Load this task plugin recursively.
        task.loadNpmTasks(path.relative(root, filepath));
      }
    });
    loadTaskDepth--;
    return;
  }

  // Process task plugins.
  var tasksdir = path.join(root, name, 'tasks');
  if (grunt.file.exists(tasksdir)) {
    task.searchDirs.unshift(tasksdir);
    loadTasks(tasksdir);
  } else {
    grunt.log.error('Local Npm module "' + name + '" not found. Is it installed?');
  }
};

// Initialize tasks.
task.init = function(tasks, options) {
  if (!options) { options = {}; }

  // Hard-coding the "init" task, for now.
  loadTasksMessage('built-in');
  var tasksdir = path.join(path.dirname(require.resolve('grunt-init')), 'tasks');
  task.searchDirs.unshift(tasksdir);
  loadTasks(tasksdir);

  // Were only init tasks specified?
  var allInit = tasks.length > 0 && tasks.every(function(name) {
    var obj = task._taskPlusArgs(name).task;
    return obj && obj.init;
  });

  // Get any local Gruntfile or tasks that might exist. Use --gruntfile override
  // if specified, otherwise search the current directory or any parent.
  var gruntfile = allInit ? null : grunt.option('gruntfile') ||
    grunt.file.findup(process.cwd(), '{G,g}runtfile.{js,coffee}');

  var msg = 'Reading "' + path.basename(gruntfile) + '" Gruntfile...';
  if (gruntfile && grunt.file.exists(gruntfile)) {
    grunt.verbose.writeln().write(msg).ok();
    // Change working directory so that all paths are relative to the
    // Gruntfile's location (or the --base option, if specified).
    process.chdir(grunt.option('base') || path.dirname(gruntfile));
    // Load local tasks, if the file exists.
    loadTasksMessage('Gruntfile');
    loadTask(gruntfile);
  } else if (options.help || allInit) {
    // Don't complain about missing Gruntfile.
  } else if (grunt.option('gruntfile')) {
    // If --config override was specified and it doesn't exist, complain.
    grunt.log.writeln().write(msg).error();
    grunt.fatal('Unable to find "' + gruntfile + '" Gruntfile.', grunt.fail.code.MISSING_GRUNTFILE);
  } else if (!grunt.option('help')) {
    grunt.verbose.writeln().write(msg).error();
    if (grunt.file.findup(process.cwd(), 'grunt.js')) {
      grunt.log.errorlns('The Gruntfile name has changed to "Gruntfile.js", ' +
        'but a "grunt.js" file was found. If this is your project\'s ' +
        'Gruntfile, please rename it. (grunt 0.4.0+)');
    }
    grunt.fatal('Unable to find Gruntfile. Do you need any --help?', grunt.fail.code.MISSING_GRUNTFILE);
  }

  // Load all user-specified --npm tasks.
  (grunt.option('npm') || []).forEach(task.loadNpmTasks);
  // Load all user-specified --tasks.
  (grunt.option('tasks') || []).forEach(task.loadTasks);

  // Add tasks userDir onto searchDirs.
  tasksdir = grunt.file.userDir('tasks');
  if (tasksdir) {
    task.searchDirs.unshift(tasksdir);
  }

  // Search dirs should be unique and fully normalized absolute paths.
  task.searchDirs = grunt.util._.uniq(task.searchDirs).map(function(filepath) {
    return path.resolve(filepath);
  });
};
