var path = require('path');
var fs = require('fs');

// An internal registry of tasks and handlers.
var registry = {};

// Extend generic "task" util lib.
var parent = urequire('task').create();
exports = module.exports = Object.create(parent);

// Override built-in registerTask.
exports.registerTask = function(name, info, fn) {
  // Add task to registry.
  registry.tasks.push(name);
  // Register task.
  parent.registerTask.apply(this, arguments);
  // Override task function.
  var _fn = this._tasks[name].fn;
  this._tasks[name].fn = function() {
    // A little logging.
    log.header('Running "' + this.nameArgs + '"' +
      (this.name !== this.nameArgs ? ' (' + this.name + ')' : '') + ' task');
    // Actually run the task.
    return _fn.apply(this, arguments);
  };
  return this;
};

// This is the most common "basic task" pattern.
exports.registerBasicTask = function(name, info, fn) {
  exports.registerTask(name, info, function(arg) {
    // If an argument wasn't specified, run this task once for each config sub-prop.
    if (!arg) {
      return task.runAllProps(name);
    }
    // Any name with a possible "." has to be escaped!
    var prop = name + '.' + config.escape(arg);
    // Fail if any required config properties have been omitted.
    config.requires(prop);
    // Call original task function, passing in only the stuff you really care about.
    fn.call(this, config(prop), arg);
  });
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
  var msg = 'Loading ' + info + ' "' + file + '" tasks...';
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
      fs.readdirSync(tasksdir).forEach(function(filename) {
        loadTask(path.join(tasksdir, filename), i > 0 ? 'additional' : 'built-in');
      });
    } catch(e) {
      log.error(e.message);
    }
  });

  // Get any local config data or tasks that might exist. Use --config override
  // if specified, otherwise just look for a local grunt.js file.
  var configfile = option('config') || path.join(process.cwd(), 'grunt.js');
  var basename = path.basename(configfile);

  if (path.existsSync(configfile)) {
    // Load local tasks, if the file exists.
    loadTask(configfile, 'config file');
  } else if (option('config')) {
    // If --config override was specified and it doesn't exist, complain.
    fail.fatal('Unable to find "' + configfile + '" config file.');
  }
};
