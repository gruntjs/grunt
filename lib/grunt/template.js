/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var Template = require('grunt-legacy-template').Template;
var grunt = require('../grunt');

// build data object to pass to `_.template`
grunt.option('buildContext', function(options) {
  /* jshint validthis: true */
  var data = Object.create(options.data || grunt.config.data || {});
  // Expose grunt so that grunt utilities can be accessed, but only if it
  // doesn't conflict with an existing .grunt property.
  if (!('grunt' in data)) { data.grunt = grunt; }
  this.data = data;
  return this.data;
});

/**
 * Expose `template`
 */

module.exports = new Template(grunt.option);
