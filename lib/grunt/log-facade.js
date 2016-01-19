/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var modes = [
  null,
  'notverbose',
  'verbose'
];

var methods = [
  'debug',
  'error',
  'errorlns',
  'fail',
  'header',
  'ok',
  'oklns',
  'subhead',
  'success',
  'warn',
  'write',
  'writeflags',
  'writeln',
  'writelns',
  'writetableln'
];

var logUtils = require('grunt-legacy-log-utils');

exports.logMethodsToEvents = function(emitter) {
  var log = {
    verbose: {},
    notverbose: {},
  };
  log.verbose.or = log.notverbose;
  log.notverbose.or = log.verbose;
  log.verbose.always = log.notverbose.always = log;

  log.wordlist = logUtils.wordlist;
  log.uncolor = logUtils.uncolor;
  log.wraptext = logUtils.wraptext;
  log.table = logUtils.table;

  modes.forEach(function(mode) {
    var namespace = mode ? log[mode] : log;
    methods.forEach(function(method) {
      namespace[method] = function() {
        emitter.emit('log', {
          mode: mode,
          method: method,
          args: [].slice.call(arguments, 0),
        });
        return namespace;
      };
    });
  });

  return log;
};

exports.logEventsToMethods = function(log, emitters) {
  emitters.forEach(function(emitter) {
    emitter.on('log', function(data) {
      var namespace = data.mode ? log[data.mode] : log;
      namespace[data.method].apply(namespace, data.args);
    });
  });
};
