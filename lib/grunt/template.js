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

exports.today = function(format) {
  return dateformat(new Date(), format);
};

exports.stripBanner = function(src) {
  return src.replace(/^\s*\/\*[^!][\s\S]*?\*\/\s*/, '');
};

// Set underscore template delimiters.
exports.delimiters = function(mode) {
  var modes = {
    // The underscore default template syntax should be a pretty sane default.
    default: {
      evaluate:     /<%([\s\S]+?)%>/g,
      interpolate:  /<%=([\s\S]+?)%>/g,
      escape:       /<%-([\s\S]+?)%>/g
    },
    // The "init" task needs separate delimiters to avoid conflicts, so the <>
    // are replaced with {}. Otherwise, they behave the same.
    init: {
      evaluate:     /\{%([\s\S]+?)%\}/g,
      interpolate:  /\{%=([\s\S]+?)%\}/g,
      escape:       /\{%-([\s\S]+?)%\}/g
    }
  };
  underscore.templateSettings = modes[mode in modes ? mode : 'default'];
};

// Process template + data with underscore.
exports.process = function(template, data, mode) {
  // Set delimiters if necessary.
  exports.delimiters(mode);
  // Render and return template.
  return util.normalizelf(underscore.template(template)(data));
};
