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

// An external utility, exposed.
exports.hooker = require('hooker');

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

// String chomp.
exports.chomp = function(str) {
  return String(str).replace(/\s+$/, '');
};

// Return the string `str` repeated `n` times.
exports.repeat = function(n, str) {
  return new Array(n + 1).join(str || ' ');
};
