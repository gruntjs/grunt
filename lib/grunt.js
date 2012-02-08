/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var path = require('path');

// Perhaps, someday, this will be the only global.
global.grunt = {};

// Used to require grunt libs. Sweet, sugary goodness. Mmmmn.
grunt.require = function(libname) { return require(path.join(__dirname, 'grunt', libname)); };

// External libs, exposed globally for convenience.
global.async = require('async');
global.underscore = require('underscore');

// Internal grunt libs, exposed globally for convenience.
global.util = grunt.require('util');
global.task = grunt.require('task');
global.file = grunt.require('file');
global.fail = grunt.require('fail');
global.config = grunt.require('config');
global.option = grunt.require('option');
global.template = grunt.require('template');
global.log = grunt.require('log');
global.verbose = log.verbose;

grunt.version = file.readJson(path.join(__dirname, '../package.json')).version;
exports.version = grunt.version;

// Handle exceptions.
process.on('uncaughtException', function (e) {
  fail.warn(e, 3);
});

// Disable colors if --no-colors was passed.
function initColors() {
  var methods = Object.keys(String.prototype);
  // Requiring this here will modify String prototype everywhere.
  require('colors');

  // Disable colors.
  if (option('no-color')) {
    // Override "colors".
    Object.keys(String.prototype).filter(function(method) {
      // Filter out methods that existed before "colors" was required.
      return methods.indexOf(method) === -1;
    }).forEach(function(method) {
      // Replace each new method with a function that just returns `this`.
      String.prototype.__defineGetter__(method, function() { return this; });
    });

    // Override console.log (nodeunit, maybe others).
    console._log = console.log;
    console.log = function() {
      var args = util.toArray(arguments).map(function(value) {
        if (typeof value === 'string') {
          return value.replace(/\033\[[\d;]+m/g, '');
        }
        return value;
      });
      console._log.apply(console, args);
    };
  }
}

// Expose the task interface. I've never called this manually, and have no idea
// how it will work. But it might.
exports.tasks = function(tasks, options, done) {
  // Update options with passed-in options.
  option.init(options);

  // Init colors.
  initColors();

  if (option('help')) {
    // Load and display help if the user did --help.
    grunt.require('help');
  } else if (option('version')) {
    // Display the current grunt version if the user did --version.
    log.writeln('grunt v' + grunt.version);
    return;
  }

  // A little header stuff.
  verbose.header('Initializing').writeflags(option.flags(), 'Command-line options');

  // Determine and output which tasks will be run.
  var tasksSpecified = tasks && tasks.length > 0;
  tasks = task.parseArgs([tasksSpecified ? tasks : 'default']);

  // Initialize tasks.
  task.init(tasks);

  verbose.writeln();
  if (!tasksSpecified) {
    verbose.writeln('No tasks specified, running default tasks.');
  }
  verbose.writeflags(tasks, 'Running tasks');

  // Report, etc when all tasks have completed.
  task.options({
    error: function(e) {
      fail.warn(e, 3);
    },
    done: function() {
      // Output a final fail / success report.
      fail.report();

      if (done) {
        // Execute "done" function when done (only if passed, of course).
        done();
      } else {
        // Otherwise, explicitly exit.
        process.exit(0);
      }
    }
  });

  // Execute all tasks, in order. Passing each task individually in a forEach
  // allows the error callback to execute multiple times.
  tasks.forEach(function(name) { task.run(name); });
  task.start();
};

// This is only executed when run via command line.
exports.cli = function(options, done) {
  // Parse task list and options from the command line.
  var cli = grunt.require('cli');

  // CLI-parsed options override any passed-in "default" options.
  underscore.defaults(cli.options, options);

  // Run tasks.
  exports.tasks(cli.tasks, cli.options, done);
};
