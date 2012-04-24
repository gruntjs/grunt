/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// Nodejs libs.
var spawn = require('child_process').spawn;

// The module to be exported.
var utils = module.exports = {};

// A few internal utilites, exposed.
utils.task = require('../util/task');
utils.namespace = require('../util/namespace');

// External libs.
utils.hooker = require('hooker');
utils.async = require('async');
var _ = utils._ = require('underscore');

// Mixin Underscore.string methods.
_.str = require('underscore.string');
_.mixin(_.str.exports());

// Return a function that normalizes the given function either returning a
// value or accepting a "done" callback that accepts as single value.
utils.callbackify = function(fn) {
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

// The line feed char for the current system.
utils.linefeed = process.platform === 'win32' ? '\r\n' : '\n';

// Normalize linefeeds in a string.
utils.normalizelf = function(str) {
  return str.replace(/\r\n|\n/g, utils.linefeed);
};

// What "kind" is a value?
// I really need to rework https://github.com/cowboy/javascript-getclass
var kindsOf = {};
'Number String Boolean Function RegExp Array Date Error'.split(' ').forEach(function(k) {
  kindsOf['[object ' + k + ']'] = k.toLowerCase();
});
utils.kindOf = function(value) {
  // Null or undefined.
  if (value == null) { return String(value); }
  // Everything else.
  return kindsOf[kindsOf.toString.call(value)] || 'object';
};

// Coerce something to an Array.
utils.toArray = Function.call.bind(Array.prototype.slice);

// Return the string `str` repeated `n` times.
utils.repeat = function(n, str) {
  return new Array(n + 1).join(str || ' ');
};

// Given str of "a/b", If n is 1, return "a" otherwise "b".
utils.pluralize = function(n, str, separator) {
  var parts = str.split(separator || '/');
  return n === 1 ? (parts[0] || '') : (parts[1] || '');
};

// Recurse through objects and arrays, executing fn for each non-object.
utils.recurse = function recurse(value, fn, fnContinue) {
  var obj;
  if (fnContinue && fnContinue(value) === false) {
    // Skip value if necessary.
    return value;
  } else if (utils.kindOf(value) === 'array') {
    // If value is an array, recurse.
    return value.map(function(value) {
      return recurse(value, fn, fnContinue);
    });
  } else if (utils.kindOf(value) === 'object') {
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
utils.spawn = function(opts, done) {
  var child = spawn(opts.cmd, opts.args, opts.opts);
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
