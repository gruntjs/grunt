/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var grunt = require('../grunt');
var template = module.exports = {};

var dateformat = require('dateformat');

// Miscellanous template helpers

template.today = function(format) {
  return dateformat(new Date(), format);
};

template.stripBanner = function(src) {
  return src.replace(/^\s*\/\*[^!][\s\S]*?\*\/\s*/, '');
};

// Set underscore template delimiters.
template.delimiters = function(mode) {
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
  grunt.utils._.templateSettings = settings;
  // Get opener character for grunt to use.
  var opener = settings.opener;
  // Remove it from the underscore object and return it.
  delete settings.opener;
  return opener;
};

// Process template + data with underscore.
template.process = function(template, data, mode) {
  // Set delimiters, and get a opening match character.
  var opener = grunt.template.delimiters(mode);
  // Clone data, initializing to config data or empty object if omitted.
  data = Object.create(data || grunt.config() || {});
  // Add a reference to grunt so grunt-stuff can be accessed.
  data.grunt = grunt;
  try {
    // As long as template contains template tags, render it and get the result,
    // otherwise just use the template string.
    while (template.indexOf(opener) >= 0) {
      template = grunt.utils._.template(template)(data);
    }
  } catch (e) {
    grunt.fail.warn('An error occurred while processing a template (' + e.message + ').');
  }
  // Normalize linefeeds and return.
  return grunt.utils.normalizelf(template);
};
