/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// The actual option data.
var data = {};

// Get or set an option value.
exports = module.exports = function(key, value) {
  var no = key.match(/^no-(.+)$/);
  if (arguments.length === 2) {
    return (data[key] = value);
  } else if (no) {
    return data[no[1]] === false;
  } else {
    return data[key];
  }
};

// Initialize option data.
exports.init = function(obj) {
  return (data = obj || {});
};

// List of options as flags.
exports.flags = function() {
  return Object.keys(data).map(function(key) {
    var val = data[key];
    return '--' + (val === false ? 'no-' : '') + key + (typeof val === 'boolean' ? '' : '=' + val);
  });
};
