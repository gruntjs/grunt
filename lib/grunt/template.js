/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var dateformat = require('dateformat');

// Miscellanous template helpers

exports.formatToday = function(format) {
  return dateformat(new Date(), format);
};

exports.joinItems = function(items, separator) {
  return items.join(typeof separator === 'string' ? separator : ', ');
};

exports.stripBanner = function(src) {
  return src.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
};
