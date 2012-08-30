/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

module.exports = function(grunt) {

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  // Get a config property. Most useful as a directive like <config:foo.bar>.
  grunt.registerHelper('config', grunt.config);

  // Get a config property and process it as a template.
  grunt.registerHelper('config_process', grunt.config.process);

};
