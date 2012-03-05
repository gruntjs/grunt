/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// A few internal utilites, exposed.
exports.task = require('../util/task');
exports.namespace = require('../util/namespace');

// A few external utilites, exposed.
exports.hooker = require('hooker');
exports.async = require('async');
exports._ = require('underscore');
exports._.str = require('underscore.string');
exports._.mixin(exports._.str.exports());

// The line feed char for the current system.
exports.linefeed = process.platform === 'win32' ? '\r\n' : '\n';

// Normalize linefeeds in a string.
exports.normalizelf = function(str) {
  return str.replace(/\r\n|\n/g, exports.linefeed);
};

// What "kind" is a value?
// I really need to rework https://github.com/cowboy/javascript-getclass
var kindsOf = {};
'Number String Boolean Function RegExp Array Date Error'.split(' ').forEach(function(k) {
  kindsOf['[object ' + k + ']'] = k.toLowerCase();
});
exports.kindOf = function(value) {
  if (value === null) {
    return 'null';
  } else if (value == null) {
    return 'undefined';
  }
  return kindsOf[kindsOf.toString.call(value)] || 'object';
};

// Coerce something to an Array.
exports.toArray = Function.prototype.call.bind(Array.prototype.slice);

// Return the string `str` repeated `n` times.
exports.repeat = function(n, str) {
  return new Array(n + 1).join(str || ' ');
};
