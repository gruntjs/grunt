/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var path = require('path');
var optlist = grunt.require('cli').optlist;

task.init([], true);

// Build 2-column array for table view.
var col1len = 0;
var opts = Object.keys(optlist).map(function(long) {
  var o = optlist[long];
  var col1 = '--' + long + (o.short ? ', -' + o.short : '');
  col1len = Math.max(col1len, col1.length);
  return [col1, o.info];
});

var tasks = Object.keys(task._tasks).map(function(name) {
  col1len = Math.max(col1len, name.length);
  var info = task._tasks[name].info;
  if (task._tasks[name].basic) {
    info += ' *';
  }
  return [name, info];
});

// Actually write out help screen.
log.writeln('grunt: a command line build tool for JavaScript projects. (v' + grunt.version + ')');

log.header('Usage');
log.writeln(' ' + path.basename(process.argv[1]) + ' [options] [task [task ...]]');

// Widths for options/tasks table output.
var widths = [1, col1len, 2, 77 - col1len];

log.header('Options');
opts.forEach(function(a) { log.writetableln(widths, ['', a[0], '', a[1]]); });
log.header('Tasks');
tasks.forEach(function(a) { log.writetableln(widths, ['', a[0], '', a[1]]); });

log.writeln().writelns(
  'Tasks run in the order specified. Arguments may be passed to tasks that accept ' +
  'them by using semicolons, like "lint:files". Tasks marked with * are "basic ' +
  'tasks" and will iterate over config sub-properties if no argument is specified.' +
  '\n\n' +
  'For more information, see https://github.com/cowboy/grunt'
);

process.exit();
