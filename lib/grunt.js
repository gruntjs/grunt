// Requiring this here will modify String prototype everywhere.
require('colors');
var path = require('path');

// Used to require grunt libs. Sweet, sugary goodness. Mmmmn.
global.grequire = function(libname) { return require(path.join(__dirname, 'grunt', libname)); };
// Used to require util libs.
global.urequire = function(libname) { return require(path.join(__dirname, 'util', libname)); };
// Some useful globals. I'm lazy.
global._ = require('underscore');
global.task = grequire('task');
global.file = grequire('file');
global.fail = grequire('fail');
global.config = grequire('config');
global.option = grequire('option');
global.log = grequire('log');
global.verbose = log.verbose;

// Expose the task interface.
exports.tasks = function(tasks, options, done) {
  // Update options with passed-in options.
  option.init(options);

  // A little header stuff.
  verbose.header('Initializing').indent().writeflags(option.flags());

  // Initialize tasks.
  task.init();

  // Determine and output which tasks will be run.
  if (!tasks || tasks.length === 0) {
    verbose.writeln('No tasks specified, running default tasks.');
    tasks = config('default_tasks');
  }
  verbose.writeflags(task.parseArgs([tasks]), 'Specified tasks').unindent();

  // Report, etc when all tasks have completed.
  task.done(function() {
    // Output a final fail / success report.
    grequire('fail').report();
    // Execute "done" function when done (only if passed, of course).
    if (done) {
      done();
    }
  });

  try {
    // Execute all tasks, in order.
    task.run(tasks).start();
  } catch (e) {
    fail.fatal(e);
  }
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
