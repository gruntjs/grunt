/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

var assert = require('assert');

module.exports = {

  'pull-requests': {
    'should always be made against the devel branch': function(pull) {
      assert.equal(pull.base.ref, 'devel');
    },
    'should always be made from feature branches': function(pull) {
      assert.notEqual(pull.head.ref, 'master');
    },
    'after': function(pull) {
      if (pull.reporter.stats.failures) {
        pull.reportFailures(pull.close.bind(pull));
      }
    }
  }

};