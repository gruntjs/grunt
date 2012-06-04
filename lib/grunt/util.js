/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

// Nodejs libs.
var spawn = require('child_process').spawn;
var nodeUtil = require('util');

// The module to be exported.
var util = module.exports = {};

// A few internal utilites, exposed.
util.task = require('../util/task');
util.namespace = require('../util/namespace');

// External libs.
util.hooker = require('hooker');
util.async = require('async');
var _ = util._ = require('underscore');
var which = require('which').sync;

// Mixin Underscore.string methods.
_.str = require('underscore.string');
_.mixin(_.str.exports());

// Return a function that normalizes the given function either returning a
// value or accepting a "done" callback that accepts a single value.
util.callbackify = function(fn) {
  return function callbackable() {
    // Invoke original function, getting its result.
    var result = fn.apply(this, arguments);
    // If the same number or less arguments were specified than fn accepts,
    // assume the "done" callback was already handled.
    var length = arguments.length;
    if (length === fn.length) { return; }
    // Otherwise, if the last argument is a function, assume it is a "done"
    // callback and call it.
    var done = arguments[length - 1];
    if (typeof done === 'function') { done(result); }
  };
};

// Create a new Error object, with an origError property that will be dumped
// if grunt was run with the --debug=9 option.
util.error = function(err, origError) {
  if (!nodeUtil.isError(err)) { err = new Error(err); }
  if (origError) { err.origError = origError; }
  return err;
};

// The line feed char for the current system.
util.linefeed = process.platform === 'win32' ? '\r\n' : '\n';

// Normalize linefeeds in a string.
util.normalizelf = function(str) {
  return str.replace(/\r\n|\n/g, util.linefeed);
};

// What "kind" is a value?
// I really need to rework https://github.com/cowboy/javascript-getclass
var kindsOf = {};
'Number String Boolean Function RegExp Array Date Error'.split(' ').forEach(function(k) {
  kindsOf['[object ' + k + ']'] = k.toLowerCase();
});
util.kindOf = function(value) {
  // Null or undefined.
  if (value == null) { return String(value); }
  // Everything else.
  return kindsOf[kindsOf.toString.call(value)] || 'object';
};

// Coerce something to an Array.
util.toArray = Function.call.bind(Array.prototype.slice);

// Return the string `str` repeated `n` times.
util.repeat = function(n, str) {
  return new Array(n + 1).join(str || ' ');
};

// Given str of "a/b", If n is 1, return "a" otherwise "b".
util.pluralize = function(n, str, separator) {
  var parts = str.split(separator || '/');
  return n === 1 ? (parts[0] || '') : (parts[1] || '');
};

// Recurse through objects and arrays, executing fn for each non-object.
util.recurse = function recurse(value, fn, fnContinue) {
  var obj;
  if (fnContinue && fnContinue(value) === false) {
    // Skip value if necessary.
    return value;
  } else if (util.kindOf(value) === 'array') {
    // If value is an array, recurse.
    return value.map(function(value) {
      return recurse(value, fn, fnContinue);
    });
  } else if (util.kindOf(value) === 'object') {
    // If value is an object, recurse.
    obj = {};
    Object.keys(value).forEach(function(key) {
      obj[key] = recurse(value[key], fn, fnContinue);
    });
    return obj;
  } else {
    // Otherwise pass value into fn and return.
    return fn(value);
  }
};

// Spawn a child process, capturing its stdout and stderr.
util.spawn = function(opts, done) {
  // On Windows, child_process.spawn will only file .exe files in the PATH, not
  // other executable types (grunt issue #155).
  var cmd;
  try {
    cmd = which(opts.cmd);
  } catch (e) {
    done(e, e, 127);
    return;
  }
  var child = spawn(cmd, opts.args, opts.opts);
  var stdout = '';
  var stderr = '';
  child.stdout.on('data', function(buf) { stdout += buf; });
  child.stderr.on('data', function(buf) { stderr += buf; });
  child.on('exit', function(code) {
    // Remove trailing whitespace (newline)
    stdout = _.rtrim(stdout);
    stderr = _.rtrim(stderr);
    // To keep JSHint from complaining about using new String().
    var MyString = String;
    // Create a new string... with properties.
    var result = new MyString(code === 0 ? stdout : 'fallback' in opts ? opts.fallback : stderr);
    result.stdout = stdout;
    result.stderr = stderr;
    result.code = code;
    // On error, pass result object as error object.
    done(code === 0 || 'fallback' in opts ? null: result, result, code);
  });
  return child;
};
