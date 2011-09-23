// Use `grequire` instead of `require` to load grunt libs.
global.grequire = require('./grunt/grequire');

var verbose = grequire('log').verbose;

// Expose the task interface.
var tasks = exports.tasks = function(tasks, options) {
  // Make options globally available. This saves all the work of having to
  // pass it around everywhere. I'm far too lazy for that.
  global.__options = options;

  // Print out specified options.
  var arr = Object.keys(options).map(function(key) {
    var val = options[key];
    return '--' + (val === false ? 'no-' : '') + key + (typeof val === 'boolean' ? '' : '=' + val);
  });

  if (arr.length > 0) {
    verbose.writeln('Using specified options: ' + arr.join(', '));
  }

  // Read build options from grunt.json.
  global.__build = grequire('build');

  // If a single task is passed (string) convert it into an array, otherwise,
  // if an array of tasks is passed, use that, otherwise run the default task.
  var tasks = typeof tasks === 'string' ? [tasks] : tasks.length ? tasks : ['default']

  // Execute all tasks, in order.
  tasks.forEach(grequire('task'));

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
