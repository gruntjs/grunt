// Requiring this here will modify String prototype everywhere.
require('colors');
var path = require('path');

// Used to require grunt libs. Sweet, sugary goodness. Mmmmn.
global.grequire = function(libname) { return require(path.join(__dirname, 'grunt', libname)); };
// Used to require util libs.
global.urequire = function(libname) { return require(path.join(__dirname, 'util', libname)); };
// Apparently, you sometimes need to flush the buffer before exiting.
// https://github.com/joyent/node/issues/1669
global.exit = function(errcode) {
  if (!process.stdout.flush()) {
    process.once('drain', function() {
      process.exit(errcode);
    });
  }
};
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

  // If a single task is passed (string), convert it into an array. Otherwise,
  // if an array of tasks is passed, use that. Otherwise run the default task.
  tasks = typeof tasks === 'string' ? [tasks] : tasks.length > 0 ? tasks : ['default'];

  // Initialize tasks.
  task.init();
  verbose.unindent();

  // Report, etc when all tasks have completed.
  task.done(function() {
    // Output a final fail / success report.
    grequire('fail').report();
    // Execute "done" function when done (only if passed, of course).
    if (done) {
      done();
    }
  });

  // Execute all tasks, in order.
  task.task(tasks).run();
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
