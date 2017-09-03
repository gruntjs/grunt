'use strict';

// External lib.
var paraquire = require('paraquire')(module);

var EventEmitter2 = paraquire('eventemitter2').EventEmitter2;

// Awesome.
module.exports = new EventEmitter2({wildcard: true});
