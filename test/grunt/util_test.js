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
