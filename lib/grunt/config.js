/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var config = require('grunt-legacy-config');
var grunt = require('../grunt');

/**
 * Expose `config`
 */

module.exports = config.create(grunt.option);
