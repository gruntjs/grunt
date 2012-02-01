/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var path = require('path');
var nopt = require('nopt');

// Default options.
var options = exports.optlist = {
  help: {
    short: 'h',
    info: 'Display this help text.',
    type: Boolean
  },
  base: {
    short: 'b',
    info: 'Specify an alternate base path (by default, all file paths are relative to the config file).',
    type: path
  },
  color: {
    info: 'Colored output (default). For no colors, use --no-color.',
    type: Boolean
  },
  config: {
    short: 'c',
    info: 'Specify an alternate "grunt.js" config file.',
    type: path
  },
  debug: {
    short: 'd',
    info: 'Enable debugging mode for tasks that support it. For detailed error stack traces, specify --debug 9.',
    type: Number
  },
  force: {
    short: 'f',
    info: 'A way to force your way past warnings. Want a suggestion? Don\'t use this option, fix your code.',
    type: Boolean
  },
  tasks: {
    short: 't',
    info: 'Additional directory paths to scan for task files and task "extra" files.',
    type: Array
  },
  write: {
    info: 'Write files (default). For a dry run, use --no-write.',
    type: Boolean
  },
  verbose: {
    short: 'v',
    info: 'Verbose output. Lots more stuff in the console.',
    type: Boolean
  },
  version: {
    info: 'Print the version.',
    type: Boolean
  }
};

// Parse `options` into a form that nopt can handle.
var aliases = {};
var known = {};

Object.keys(options).forEach(function(key) {
  var option = options[key];
  var short = option.short;
  if (short) {
    aliases[short] = '--' + key;
  }
  known[key] = option.type;
});

var parsed = nopt(known, aliases, process.argv, 2);
exports.tasks = parsed.argv.remain;
exports.options = parsed;
delete parsed.argv;
