var path = require('path');
var fs = require('fs');

// An internal registry of tasks and handlers.
var registry = {};

// Extend generic "task" util lib.
var parent = urequire('task').create();
exports = module.exports = Object.create(parent);

// Map of taskname-to-infos.
exports.infos = {};

// Override built-in registerTask to allow storing infos.
exports.registerTask = function(name, info, fn) {
  // Store description.
  exports.infos[name] = info;
  // Add task to registry.
  registry.tasks.push(name);
  // Register task.
  return parent.registerTask(name, function() {
    // A little logging.
    verbose.indent(0).header('Running "' + name + '" task').indent();
    // Actually run task.
    return fn.apply(this, arguments);
  });
};

// Override built-in registerHelper to use the registry.
exports.registerHelper = function(name, fn) {
  // Add task to registry.
  registry.helpers.push(name);
  // Actually register task.
  return parent.registerHelper(name, fn);
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
    verbose.ok().indent(function() {
      if (registry.tasks.length > 0) {
        verbose.writeln('Tasks: ' + log.wordlist(registry.tasks));
      }
      if (registry.helpers.length > 0) {
        verbose.writeln('Helpers: ' + log.wordlist(registry.helpers));
      }
    });
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().indent().error(e.message).unindent();
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
    // If --tasks override was specified and it doesn't exist, complain.
    fail.warn('Unable to find "' + configfile + '" config file.');
  }
};
