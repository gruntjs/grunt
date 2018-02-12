'use strict';

var grunt = require('../../lib/grunt');
var deprecate = require('../../lib/grunt/deprecate');

exports.deprecate = {
  setUp: function(done) {
    this.oldGruntLogWarn = grunt.log.warn;
    this.oldHideDeprecations = grunt.option('hide-deprecations');
    this.oldStack = grunt.option('stack');
    grunt.option('hide-deprecations', false);
    grunt.option('stack', false);
    var api = {val: function() {}};
    var util = {api: api};
    this.fixture = {util: util};
    done();
  },
  tearDown: function(done) {
    this.fixture = null;
    grunt.log.warn = this.oldGruntLogWarn;
    grunt.option('hide-deprecations', this.oldHideDeprecations);
    grunt.option('stack', this.oldStack);
    done();
  },
  'deprecate warning on get': function(test) {
    test.expect(1);
    grunt.log.warn = function(message) {
      test.equal(message, 'this api is deprecated', 'grunt.log.warn should have got the deprecation message when getting a deprecated api.');
      test.done();
    };
    deprecate(this.fixture.util, 'api', 'this api is deprecated');
    this.fixture.util.api.val();
  },
  'deprecate warning on set': function(test) {
    test.expect(1);
    grunt.log.warn = function(message) {
      test.equal(message, 'this api is deprecated', 'grunt.log.warn should have got the deprecation message when setting a deprecated api.');
      test.done();
    };
    deprecate(this.fixture.util, 'api', 'this api is deprecated');
    this.fixture.util.api = {};
  },
  'hide deprecations': function(test) {
    test.expect(1);
    grunt.option('hide-deprecations', true);
    grunt.log.warn = function(message) {
      test.equal(message, 'did not show deprecation message', 'grunt.log.warn should not have displayed a deprecation message with hide-deprecations enabled.');
      test.done();
    };
    deprecate(this.fixture.util, 'api', 'this api is deprecated');
    this.fixture.util.api.val();
    grunt.log.warn('did not show deprecation message');
  },
  'deprecations with stack trace': function(test) {
    test.expect(2);
    grunt.option('stack', true);
    grunt.log.warn = function(message) {
      message = message.split(grunt.util.linefeed);
      test.equal(message[0], 'Error: this api is deprecated', 'grunt.log.warn should not have displayed a deprecation message with stack trace.');
      test.ok(message.length > 1);
      test.done();
    };
    deprecate(this.fixture.util, 'api', 'this api is deprecated');
    this.fixture.util.api.val();
  },
};
