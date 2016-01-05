/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var cli = require('grunt-legacy-cli');
var grunt = require('../grunt');

/**
 * Expose `cli`
 */

module.exports = cli.create({grunt: grunt});
