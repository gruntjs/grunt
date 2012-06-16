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

  // Read a JSON file. Most useful as a directive like <json:package.json>.
  var jsons = {};
  grunt.registerHelper('json', function(filepath) {
    // Don't re-fetch if being called as a directive and JSON is already cached.
    if (!this.directive || !(filepath in jsons)) {
      jsons[filepath] = grunt.file.readJSON(filepath);
    }
    return jsons[filepath];
  });

  // Return the given source coude with any leading banner comment stripped.
  grunt.registerHelper('strip_banner', function(src, options) {
    if (!options) { options = {}; }
    var m = [];
    if (options.line) {
      // Strip // ... leading banners.
      m.push('(?:.*\\/\\/.*\\n)*\\s*');
    }
    if (options.block) {
      // Strips all /* ... */ block comment banners.
      m.push('\\/\\*[\\s\\S]*?\\*\\/');
    } else {
      // Strips only /* ... */ block comment banners, excluding /*! ... */.
      m.push('\\/\\*[^!][\\s\\S]*?\\*\\/');
    }
    var re = new RegExp('^\\s*(?:' + m.join('|') + ')\\s*', '');
    return src.replace(re, '');
  });

  // Get a source file's contents with any leading banner comment stripped. If
  // used as a directive, get options from the flags object.
  grunt.registerHelper('file_strip_banner', function(filepath, options) {
    if (this.directive) { options = this.flags; }
    var src = grunt.file.read(filepath);
    return grunt.helper('strip_banner', src, options);
  });

  // Process a file as a template.
  grunt.registerHelper('file_template', function(filepath) {
    var src = grunt.file.read(filepath);
    return grunt.template.process(src);
  });

  // Generate banner from template. This helper is deprecated.
  var bannerWarned;
  grunt.registerHelper('banner', function(prop) {
    if (!bannerWarned) {
      bannerWarned = true;
      grunt.log.errorlns('Note that the "banner" helper and directive have ' +
        'been deprecated. Please use the more general "config_process" ' +
        'helper and/or directive (which does NOT automatically add a ' +
        'trailing newline!) instead. (grunt 0.4.0+)');
      // This warning shouldn't cause tasks that look at this.errorCount to fail.
      // TODO: come up with a better way to do non-error warnings.
      grunt.fail.errorcount--;
    }

    if (!prop) { prop = 'meta.banner'; }
    var banner;
    var tmpl = grunt.config(prop);
    if (tmpl) {
      // Now, log.
      grunt.verbose.write('Generating banner...');
      try {
        // Compile and run template, using config object as the data source.
        banner = grunt.template.process(tmpl) + grunt.util.linefeed;
        grunt.verbose.ok();
      } catch(e) {
        banner = '';
        grunt.verbose.error();
        grunt.warn(e, 11);
      }
    } else {
      grunt.warn('No "' + prop + '" banner template defined.', 11);
      banner = '';
    }
    return banner;
  });

};
