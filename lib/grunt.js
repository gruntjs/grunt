// Requiring this here will modify String prototype everywhere.
require('colors');

var path = require('path');

// Used to require grunt libs. Sweet, sugary goodness. Mmmmn.
global.grequire = function(libname) { return require(path.join(__dirname, 'grunt', libname)); };
// Used to require util libs.
global.urequire = function(libname) { return require(path.join(__dirname, 'util', libname)); };
// Used to access task "extras" files.
global.extraspath = function(taskname) { return path.resolve(__dirname, '..', 'extras', taskname); };
// Some useful globals. I'm lazy.
global._ = require('underscore');
global.task = grequire('task');
global.file = grequire('file');
global.fail = grequire('fail');
global.config = grequire('config');
global.option = grequire('option');
global.log = grequire('log');
global.verbose = log.verbose;

// Expose the task interface. I've never called this manually, and have no idea
// how it will work. But it might.
exports.tasks = function(tasks, options, done) {
  // Update options with passed-in options.
  option.init(options);

  // A little header stuff.
  verbose.header('Initializing').writeflags(option.flags(), 'Command-line options');

  // Initialize tasks.
  task.init();

  // Determine and output which tasks will be run.
  if (!tasks || tasks.length === 0) {
    verbose.writeln('No tasks specified, running default tasks.');
    tasks = 'default';
  }
  tasks = task.parseArgs([tasks]);
  verbose.writeflags(tasks, 'Running tasks');

  // Report, etc when all tasks have completed.
  task.options({
    error: function(e) {
      fail.warn(e.message);
    },
    done: function() {
      // Output a final fail / success report.
      fail.report();
      // Execute "done" function when done (only if passed, of course).
      if (done) { done(); }
    }
  });

  // Execute all tasks, in order. Passing each task individually in a forEach
  // allows the error callback to execute multiple times.
  tasks.forEach(function(name) { task.run(name); });
  task.start();
};

// This is only executed when run via command line.
exports.cli = function() {
  // Parse task list and options from the command line.
  var cli = grequire('cli');

  // Load and display help if the user did --help.
  if (cli.options.help) {
    grequire('help');
  }

  // Run tasks.
  exports.tasks(cli.tasks, cli.options);
};
