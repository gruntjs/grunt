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
  return src.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
};

// Set underscore template delimiters.
exports.delimiters = function(mode) {
  var modes = {
    // The underscore default template syntax should be a pretty sane default.
    default: {
      // Used by grunt.
      opener:       '<%',
      // Used by underscore.
      evaluate:     /<%([\s\S]+?)%>/g,
      interpolate:  /<%=([\s\S]+?)%>/g,
      escape:       /<%-([\s\S]+?)%>/g
    },
    // The "init" task needs separate delimiters to avoid conflicts, so the <>
    // are replaced with {}. Otherwise, they behave the same.
    init: {
      // Used by grunt.
      opener:       '{%',
      // Used by underscore.
      evaluate:     /\{%([\s\S]+?)%\}/g,
      interpolate:  /\{%=([\s\S]+?)%\}/g,
      escape:       /\{%-([\s\S]+?)%\}/g
    }
  };
  var settings = modes[mode in modes ? mode : 'default'];
  utils._.templateSettings = settings;
  // Get opener character for grunt to use.
  var opener = settings.opener;
  // Remove it from the underscore object and return it.
  delete settings.opener;
  return opener;
};

// Process template + data with underscore.
exports.process = function(template, data, mode) {
  // Set delimiters, and get a opening match character.
  var opener = exports.delimiters(mode);
  // If template contains template tags, render template and get result,
  // otherwise just use template string.
  var output = template.indexOf(opener) === -1 ? template :
    utils._.template(template)(data);
  // Normalize linefeeds and return.
  return utils.normalizelf(output);
};
