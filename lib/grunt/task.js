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
  // Load all built-in tasks.
  var tasksdir = path.join(__dirname, 'tasks');
  fs.readdirSync(tasksdir).forEach(function(filename) {
    loadTask(path.join(tasksdir, filename), 'built-in');
  });

  // Get any local config data or tasks that might exist. Use --config override
  // if specified, otherwise just look for a local grunt.js file.
  var configfile = option('config') || path.join(process.cwd(), 'grunt.js');
  var basename = path.basename(configfile);

  if (path.existsSync(configfile)) {
    // Load local tasks, if the file exists.
    loadTask(configfile, 'custom');
  } else if (option('config')) {
    // If --config override was specified and it doesn't exist, complain.
    fail.fatal('Unable to find "' + configfile + '" config file.');
  }
};
