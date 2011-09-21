var path = require('path');
var fs = require('fs');
var fail = require('./fail');

// Main task executing function.
var exports = module.exports = function(name) {
  // Split "task:subtask" into parts.
  var parts = name.split(':');
  // Get task.
  var task = exports[parts[0]];
  task || fail('Task ' + name + ' not found.')
  // Get subtask if specified, otherwise get the _default task.
  var subtask = task.tasks[parts[1] || '_default'];
  subtask || fail('Task ' + name + ' not found.')
  // Actually call the subtask
  subtask.call({
    task: function(name) {
      // If only :foo subtask is passed, prepend task name.
      if (/^:/.test(name)) {
        name = parts[0] + name;
      }
      // Call main task executing function.
      exports(name);
      return this;
    }
  });
  return this;
};

// Get all built-in tasks. TODO: allow "local" tasks.
fs.readdirSync(path.join(__dirname, 'tasks')).forEach(function(filepath) {
  var name = filepath.replace(/\.js$/, ''); // basename?
  exports[name] = require('./tasks/' + name);
});
