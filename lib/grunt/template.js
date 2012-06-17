/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

var grunt = require('../grunt');

// The module to be exported.
var template = module.exports = {};

// External libs.
template.date = require('dateformat');

// Format today's date.
template.today = function(format) {
  return template.date(new Date(), format);
};

// Template delimiters.
var allDelimiters = {};

// Initialize template delimiters.
template.addDelimiters = function(name, opener, closer) {
  var delimiters = allDelimiters[name] = {};
  // Used by grunt.
  delimiters.opener = opener;
  delimiters.closer = closer;
  // Generate RegExp patterns dynamically.
  var a = delimiters.opener.replace(/(.)/g, '\\$1');
  var b = '([\\s\\S]+?)' + delimiters.closer.replace(/(.)/g, '\\$1');
  // Used by Underscore.js.
  delimiters.underscore = {
    evaluate: new RegExp(a + b, 'g'),
    interpolate: new RegExp(a + '=' + b, 'g'),
    escape: new RegExp(a + '-' + b, 'g')
  };
};

// The underscore default template syntax should be a pretty sane default for
// the config system.
template.addDelimiters('config', '<%', '%>');
// The "init" task needs separate delimiters to avoid conflicts, so the <>
// are replaced with {}. Otherwise, they behave the same.
template.addDelimiters('init', '{%', '%}');
// If templates are needed that won't by auto-processed by grunt, this
// syntax can be used and then processed manually with template.process.
template.addDelimiters('user', '[%', '%]');

// Set Underscore.js template delimiters.
template.setDelimiters = function(name) {
  // Get the appropriate delimiters.
  var delimiters = allDelimiters[name in allDelimiters ? name : 'config'];
  // Tell Underscore.js which delimiters to use.
  grunt.util._.templateSettings = delimiters.underscore;
  // Return the delimiters.
  return delimiters;
};

// Process template + data with underscore.
template.process = function(tmpl, data, options) {
  if (!options) { options = {}; }
  // Set delimiters, and get a opening match character.
  var delimiters = template.setDelimiters(options.delimiters);
  // Clone data, initializing to config data or empty object if omitted.
  data = Object.create(data || grunt.config() || {});
  // Expose grunt so that grunt utilities can be accessed, but only if it
  // doesn't conflict with an existing .grunt property.
  if (!('grunt' in data)) { data.grunt = grunt; }
  // Keep track of last change.
  var last = tmpl;
  try {
    // As long as tmpl contains template tags, render it and get the result,
    // otherwise just use the template string.
    while (tmpl.indexOf(delimiters.opener) >= 0) {
      tmpl = grunt.util._.template(tmpl, data);
      // Abort if template didn't change - nothing left to process!
      if (tmpl === last) { break; }
      last = tmpl;
    }
  } catch (e) {
    // In upgrading to Underscore.js 1.3.3, \n and \r in templates tags now
    // causes an exception to be thrown. Warn the user why this is happening.
    // https://github.com/documentcloud/underscore/issues/553
    if (String(e) === 'SyntaxError: Unexpected token ILLEGAL' && /\n|\r/.test(tmpl)) {
      grunt.log.errorlns('A special character was detected in this template. ' +
        'Inside template tags, the \\n and \\r special characters must be ' +
        'escaped as \\\\n and \\\\r. (grunt 0.4.0+)');
    }
    grunt.warn('An error occurred while processing a template (' + e.message + ').');
  }
  // Normalize linefeeds and return.
  return grunt.util.normalizelf(tmpl);
};
