// Use `grequire` instead of `require` to load grunt libs.
global.grequire = require('./grunt/grequire');

// Expose the task interface.
var tasks = exports.tasks = function(tasks, options) {
  // Make options globally available. This saves all the work of having to
  // pass it around everywhere. I'm far too lazy for that.
  global.__options = options;
  
  // Read metadata from grunt.json.
  global.__meta = grequire('meta');

  // If a single task is passed (string) convert it into an array, otherwise,
  // if an array of tasks is passed, use that, otherwise run the default task.
  var tasks = typeof tasks === 'string' ? [tasks] : tasks.length ? tasks : ['default']

  // Execute all tasks, in order.
  tasks.forEach(grequire('task'));
};

// This is only executed when run via command line.
exports.cli = function() {
  // Parse task list and options from the command line.
  var cli = grequire('cli');

  // TODO: stuff.
  cli.options.help && grequire('help');

  // Run tasks.
  tasks(cli.tasks, cli.options);
};
