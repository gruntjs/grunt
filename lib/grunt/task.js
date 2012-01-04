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
    require(filepath);
    verbose.ok();
    if (registry.tasks.length > 0) {
      verbose.writeln('Tasks: ' + log.wordlist(registry.tasks));
    }
    if (registry.helpers.length > 0) {
      verbose.writeln('Helpers: ' + log.wordlist(registry.helpers));
    }
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().error(e.message);
  }
}

// Initialize tasks.
exports.init = function(nofatal) {
  // Iterate over a task directory and load each found task.
  function loadTasksFolder(tasksdir, info) {
    fs.readdirSync(tasksdir).forEach(function(filename) {
      loadTask(path.join(tasksdir, filename), info);
    });
  }

  // Load all built-in tasks.
  loadTasksFolder(path.join(__dirname, 'tasks'), 'built-in');

  // Get any local config data or tasks that might exist. Use --config override
  // if specified, otherwise just look for a local grunt.js file.
  var configfile = path.join(process.cwd(), option('config') || 'grunt.js');
  var basename = path.basename(configfile);
  var additionalTasks = option('additionalTasks');

  // Load additional folder tasks
  if (additionalTasks) {
    // Ensure to prefix the process.cwd() so that paths remain relative.
    additionalTasksPath = path.join(process.cwd(), option('additionalTasks'));

    // Load all additional tasks.
    loadTasksFolder(additionalTasksPath, 'additional');
  }

  if (path.existsSync(configfile)) {
    // Load local tasks, if the file exists.
    loadTask(configfile, 'custom');
  } else if (option('config')) {
    // If --config override was specified and it doesn't exist, complain.
    fail.fatal('Unable to find "' + configfile + '" config file.');
  }
};
