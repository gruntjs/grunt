/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// Nodejs libs.
var path = require('path');

// This allows grunt to require() .coffee files.
require('coffee-script');

// The module to be exported.
var grunt = module.exports = {};

// Expose internal grunt libs.
function gRequire(name) {
  return grunt[name] = require('./grunt/' + name);
}
var utils = gRequire('utils');
var template = gRequire('template');
var fail = gRequire('fail');
var file = gRequire('file');
var option = gRequire('option');
var config = gRequire('config');
var task = gRequire('task');
var log = gRequire('log');
var cli = gRequire('cli');
var verbose = grunt.verbose = log.verbose;

grunt.version = file.readJSON(path.join(__dirname, '../package.json')).version;

// Expose specific grunt lib methods on grunt.
function gExpose(obj, methodName, newMethodName) {
  grunt[newMethodName || methodName] = obj[methodName].bind(obj);
}
gExpose(task, 'registerTask');
gExpose(task, 'registerMultiTask');
gExpose(task, 'registerInitTask');
gExpose(task, 'renameTask');
gExpose(task, 'registerHelper');
gExpose(task, 'renameHelper');
gExpose(task, 'helper');
gExpose(task, 'loadTasks');
gExpose(task, 'registerTask');
gExpose(task, 'loadNpmTasks');
gExpose(config, 'init', 'initConfig');
gExpose(fail, 'warn');
gExpose(fail, 'fatal');

// Handle exceptions.
// process.on('uncaughtException', function (e) {
//   fail.warn(e, 3);
// });

// Disable colors if --no-colors was passed.
function initColors() {
  var methods = Object.keys(String.prototype);
  // Requiring this here will modify String prototype everywhere.
  var colors = require('colors');

  // Disable colors.
  if (option('no-color')) {
    colors.mode = 'none';

    // Strip colors from strings passed to console.log.
    utils.hooker.hook(console, 'log', function() {
      var args = utils.toArray(arguments);
      return utils.hooker.filter(this, args.map(function(arg) {
        return typeof arg === 'string' ? colors.stripColors(arg) : arg;
      }));
    });
  }
}

// Expose the task interface. I've never called this manually, and have no idea
// how it will work. But it might.
grunt.tasks = function(tasks, options, done) {
  // Update options with passed-in options.
  option.init(options);

  // Display the grunt version and quit if the user did --version.
  if (option('version')) {
    // Not --verbose.
    verbose.or.writeln('grunt v' + grunt.version);
    // --verbose
    verbose.writeln('Version: v' + grunt.version);
    verbose.writeln('Install path: ' + path.resolve(__dirname, '..'));
    return;
  }

  // Init colors.
  initColors();

  // Display help and quit if the user did --help.
  if (option('help')) {
    require('./grunt/help');
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

// Register one or more Npm-installed grunt plugins inside that plugin's bin.
grunt._npmTasks = [];
grunt.npmTasks = function(tasks) {
  grunt._npmTasks = Array.isArray(tasks) ? tasks : [tasks];
  return grunt;
};
