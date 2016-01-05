/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var Fail = require('grunt-legacy-fail').Fail;
var grunt = require('../grunt');

/**
 * Expose `fail`
 */

module.exports = new Fail(grunt.option);
