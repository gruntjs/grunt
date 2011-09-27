var path = require('path');
var fs = require('fs');

var log = grequire('log');
var verbose = log.verbose;

var fail = grequire('fail');

// This gets reused, so let's save it for later.
var slice = [].slice;

// ============================================================================
// HELPERS
// ============================================================================

// All helpers go here.
exports.helpers = {};

// Register a helper.
exports.registerHelper = function(name, fn) {
  verbose.write('Registering "' + name + '" helper...').ok();
  exports.helpers[name] = fn;
};

// Execute a helper by name.
exports.helper = function(name) {
  // Invoke the helper function with all args passed after the name.
  return exports.helpers[name].apply(this, slice.call(arguments, 1));
};

// ============================================================================
// TASKS
// ============================================================================

// All tasks go here.
exports.tasks = {};

// Register a task.
exports.registerTask = function(name, info, fn) {
  verbose.write('Registering "' + name + '" task...').ok();
  exports.tasks[name] = {info: info, fn: fn, prev: exports.tasks[name]};
};

// Execute a task by name.
exports.task = function(name) {
  // Get task object.
  var task = exports.tasks[name];
  // Oops?
  if (!task) {
    fail.warn('Task "' + name + '" not found.');
  } else {
    verbose.indent(0).header('Running "' + name + '" task').indent();
    // Actually execute the task/subtask function, setting `this` to something
    // useful.
    task.fn.apply({
      task: exports.task,
      helper: exports.helper,
      super: task.prev ? task.prev.fn : function() {}
    }, slice.call(arguments, 1));
  }
  // Make chainable!
  return this;
};

// ============================================================================
// INIT
// ============================================================================

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

// Load all tasks from a given directory path.
function loadTasks(dirpath, info) {
  // Abort if dirpath doesn't exist.
  if (!path.existsSync(dirpath)) { return; }
  // For each .js file under dirpath, add a task.
  fs.readdirSync(dirpath).forEach(function(filepath) {
    var file = path.basename(filepath);
    var msg = 'Loading ' + info + ' "' + file + '" taskfile.';
    verbose.writeln(msg).indent();
    try {
      // Load taskfile.
      require(path.join(dirpath, file));
    } catch(e) {
      // Something went wrong.
      verbose.or.write(msg + '..').error();
      log.indent().error(e.message).unindent();
    }
    verbose.unindent();
  });
}


// // Execute a task by name.
// exports.task = function task(name) {
//   // Split "task:subtask" into parts.
//   var parts = name.split(':');
//   // Get task object.
//   var obj = tasks[parts[0]];
//   // Get actual task/subtask function.
//   var fn;
//   if (obj) {
//     // Get subtask if specified, otherwise use the default task function.
//     fn = parts[1] ? obj.subtasks[parts[1]] : obj.task;
//   }
//   // Oops?
//   if (!fn) {
//     fail.warn('Task "' + name + '" not found.');
//   } else {
//     // Actually execute the task/subtask function, setting `this` to something
//     // useful.
//     verbose.indent(0).header('Running "' + name + '" task').indent();
//     fn.call({
//       task: function(name) {
//         // Recurse. If only :subtask is passed, prepend task name.
//         // FWIW, people prefered the last (uncommented) one to these:
//         //   task(name.replace(/^(?=:)/, parts[0]));
//         //   task((/^:/.test(name) ? parts[0] : '') + name);
//         // Go figure. I like the first commented one (with that super-sexy
//         // positive look-ahead) the best.
//         task((name.charAt(0) === ':' ? parts[0] : '') + name);
//         // Make chainable!
//         return this;
//       }
//     });
//   }
//   // Make chainable!
//   return this;
// };

