/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

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
