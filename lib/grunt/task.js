var path = require('path');
var fs = require('fs');
var fail = require('./fail');

// All tasks go here..
var tasks = {}

// Load all tasks from a given directory path.
function loadTasks(dirpath) {
  // Abort if dirpath doesn't exist.
  if (!path.existsSync(dirpath)) { return; }
  // For each .js file under dirpath, add a task.
  fs.readdirSync(dirpath).forEach(function(filepath) {
    var name = path.basename(filepath, '.js');
    tasks[name] = require(path.join(dirpath, name));
  });
}

// Get all built-in tasks.
loadTasks(path.join(__dirname, 'tasks'));

// Get any local tasks that might exist. TODO: CLI option to override.
loadTasks('tasks');

// Execute a task by name.
module.exports = function task(name) {
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
  fn || fail('Task ' + name + ' not found.');
  // Actually execute the task/subtask function, setting `this` to be something
  // useful.
  fn.call({
    task: function(name) {
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
  // Make chainable!
  return this;
};
