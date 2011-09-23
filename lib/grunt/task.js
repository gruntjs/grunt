var path = require('path');
var fs = require('fs');

var log = grequire('log');
var verbose = log.verbose;

var fail = grequire('fail');

// Execute a task by name.
exports.task = function task(name) {
  // Split "task:subtask" into parts.
  var parts = name.split(':');
  // Get task object.
  var obj = tasks[parts[0]];
  // Get actual task/subtask function.
  var fn;
  if (obj) {
    // Get subtask if specified, otherwise use the default task function.
    fn = parts[1] ? obj.subtasks[parts[1]] : obj.task;
  }
  // Oops?
  if (!fn) {
    fail.warn('Task "' + name + '" not found.');
  } else {
    // Actually execute the task/subtask function, setting `this` to something
    // useful.
    verbose.header('Running "' + name + '" task').indent();
    fn.call({
      task: function(name) {
        verbose.unindent();
        // Recurse. If only :subtask is passed, prepend task name.
        // FWIW, people prefered the last (uncommented) one to these:
        //   task(name.replace(/^(?=:)/, parts[0]));
        //   task((/^:/.test(name) ? parts[0] : '') + name);
        // Go figure. I like the first commented one (with that super-sexy
        // positive look-ahead) the best.
        task((name.charAt(0) === ':' ? parts[0] : '') + name);
        // Make chainable!
        return this;
      }
    });
  }
  // Make chainable!
  return this;
};

// Initialize tasks.
exports.init = function() {
  // Get all built-in tasks.
  loadTasks(path.join(__dirname, 'tasks'), 'built-in');

  // Get any local tasks that might exist. Use --tasks override if specified.
  var tasksdir = __options.tasks || path.join(process.cwd(), 'tasks');
  var basename = path.basename(tasksdir);

  // If --tasks override was specified and it doesn't exist, complain.
  if (__options.tasks && !path.existsSync(tasksdir)) {
    fail.warn('Unable to find "' + tasksdir + '" tasks directory.');
  }

  loadTasks(tasksdir, 'local');
};

// All tasks go here.
var tasks = exports.tasks = {}

// Load all tasks from a given directory path.
function loadTasks(dirpath, info) {
  // Abort if dirpath doesn't exist.
  if (!path.existsSync(dirpath)) { return; }
  // For each .js file under dirpath, add a task.
  fs.readdirSync(dirpath).forEach(function(filepath) {
    var name = path.basename(filepath, '.js');
    var prev = tasks[name];
    var msg = 'Loading ' + info + ' "' + name + '" task...';
    verbose.write(msg);
    try {
      // Load the task.
      tasks[name] = require(path.join(dirpath, name));
      // If the task previously existed, create a reference to the old task
      // in the "super" property. TODO: USE THIS SOMEHOW?
      if (prev) {
        tasks[name].super = prev;
      }
      verbose.ok();
    } catch(e) {
      // Something went wrong.
      verbose.or.write(msg);
      log.error().indent().error(e.message).unindent();
    }
  });
}
