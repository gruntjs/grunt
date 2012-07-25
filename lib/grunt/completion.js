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

// Nodejs libs.
var path = require('path');

var name = grunt.option('completion');
var base = path.join(__dirname, '../../misc/completion');
var filepath = path.join(base, name);

if (grunt.file.exists(filepath)) {
  console.log(grunt.file.read(filepath));
} else {
  grunt.fail.fatal('Specified shell completion not found. Use' +
    ' --completion=NAME, where NAME is one of the following: ' +
    grunt.file.expandFiles({cwd: base}, '*').join(', ') + '.');
}
