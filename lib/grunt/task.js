/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var task = require('grunt-legacy-task');
var grunt = require('../grunt');

/**
 * Expose `task`
 */

module.exports = task.create({grunt: grunt});
