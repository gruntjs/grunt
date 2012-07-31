/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

// External lib.
var EventEmitter2 = require('eventemitter2').EventEmitter2;

// Awesome.
module.exports = new EventEmitter2({wildcard: true});
