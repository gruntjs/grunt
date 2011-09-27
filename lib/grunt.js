// Use `grequire` instead of `require` to load grunt libs.
global.grequire = require('./grunt/grequire');

require('colors');

// Some useful globals. I'm lazy.
global.__options = {};
global.grunt = grequire('build');
global.task = grequire('task');
global.file = grequire('file');
global.log = grequire('log');
global.verbose = log.verbose;
global.fail = grequire('fail');

// Expose a way to set build options.
global.__build = null;
global.grunt = function(obj) {
  return global.__build = obj;
};

// Expose the task interface.
var tasks = exports.tasks = function(tasks, options) {
  // Override global options with passed-in options.
  global.__options = options;

  verbose.header('Initializing').indent();

  // Print out specified options.
  var arr = Object.keys(options).map(function(key) {
    var val = options[key];
    return '--' + (val === false ? 'no-' : '') + key + (typeof val === 'boolean' ? '' : '=' + val);
  });

  if (arr.length > 0) {
    verbose.writeln('Flags: ' + arr.join(', '));
  }

  // If a single task is passed (string) convert it into an array, otherwise,
  // if an array of tasks is passed, use that, otherwise run the default task.
  var tasks = typeof tasks === 'string' ? [tasks] : tasks.length ? tasks : ['default']

  // Initialize tasks.
  task.init();
  verbose.unindent();

  // Execute all tasks, in order.
  tasks.forEach(task.task);

  // Output a final fail / success report.
  grequire('fail').report();
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
