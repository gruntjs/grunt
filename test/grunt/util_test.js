'use strict';

var grunt = require('../../lib/grunt');

exports['utils.callbackify'] = {
  'return': function(test) {
    test.expect(1);
    // This function returns a value.
    function add(a, b) {
      return a + b;
    }
    grunt.util.callbackify(add)(1, 2, function(result) {
      test.equal(result, 3, 'should be the correct result.');
      test.done();
    });
  },
  'callback (sync)': function(test) {
    test.expect(1);
    // This function accepts a callback which it calls synchronously.
    function add(a, b, done) {
      done(a + b);
    }
    grunt.util.callbackify(add)(1, 2, function(result) {
      test.equal(result, 3, 'should be the correct result.');
      test.done();
    });
  },
  'callback (async)': function(test) {
    test.expect(1);
    // This function accepts a callback which it calls asynchronously.
    function add(a, b, done) {
      setTimeout(done.bind(null, a + b), 0);
    }
    grunt.util.callbackify(add)(1, 2, function(result) {
      test.equal(result, 3, 'should be the correct result.');
      test.done();
    });
  }
};

exports['utils'] = {
  'error': function(test) {
    test.expect(9);
    var origError = new Error('Original error.');

    var err = grunt.util.error('Test message.');
    test.ok(err instanceof Error, 'Should be an Error.');
    test.equal(err.name, 'Error', 'Should be an Error.');
    test.equal(err.message, 'Test message.', 'Should have the correct message.');

    err = grunt.util.error('Test message.', origError);
    test.ok(err instanceof Error, 'Should be an Error.');
    test.equal(err.name, 'Error', 'Should be an Error.');
    test.equal(err.message, 'Test message.', 'Should have the correct message.');
    test.equal(err.origError, origError, 'Should reflect the original error.');

    var newError = new Error('Test message.');
    err = grunt.util.error(newError, origError);
    test.equal(err, newError, 'Should be the passed-in Error.');
    test.equal(err.origError, origError, 'Should reflect the original error.');
    test.done();
  },
  'linefeed': function(test) {
    test.expect(1);
    if (process.platform === 'win32') {
      test.equal(grunt.util.linefeed, '\r\n', 'linefeed should be operating-system appropriate.');
    } else {
      test.equal(grunt.util.linefeed, '\n', 'linefeed should be operating-system appropriate.');
    }
    test.done();
  },
  'normalizelf': function(test) {
    test.expect(1);
    if (process.platform === 'win32') {
      test.equal(grunt.util.normalizelf('foo\nbar\r\nbaz\r\n\r\nqux\n\nquux'), 'foo\r\nbar\r\nbaz\r\n\r\nqux\r\n\r\nquux', 'linefeeds should be normalized');
    } else {
      test.equal(grunt.util.normalizelf('foo\nbar\r\nbaz\r\n\r\nqux\n\nquux'), 'foo\nbar\nbaz\n\nqux\n\nquux', 'linefeeds should be normalized');
    }
    test.done();
  }
};
