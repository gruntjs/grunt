/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var File = require('grunt-legacy-file').File;
var grunt = require('../grunt');

/**
 * Expose `file`
 */

module.exports = new File(grunt.option);
