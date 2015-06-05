/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var logger = require('grunt-legacy-log-facade');
var File = require('grunt-legacy-file').File;
var grunt = require('../grunt');

var file = new File(grunt.option);
file.log = logger.logMethodsToEvents();
file.fail = logger.logMethodsToEvents();

/**
 * Expose `file`
 */

module.exports = file;
