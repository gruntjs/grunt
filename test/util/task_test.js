var testCase = require('nodeunit').testCase;

// Test helpers.
var result;
function push(t) { result.push(t.name); }
function delay(fn) { setTimeout(fn, 10); }
function requireTask() {
  return require('../../lib/util/task.js').create();
}

exports['task'] = testCase({
  setUp: function(done) {
    result = [];
    this.t = requireTask();
    this.t.registerTask('a', function() { push(this); });
    this.t.registerTask('b', function() { push(this); });
    this.t.registerTask('c', function() { push(this); });
    this.t.done(function() {
      this._test.deepEqual(result.join(''), 'abc', 'tests should run in-order.');
      this._test.done();
    }.bind(this));
    done();
  },
  'single': function(test) {
    test.expect(1);
    this._test = test;
    this.t.task('a').task('b').task('c').run();
  },
  'array': function(test) {
    test.expect(1);
    this._test = test;
    this.t.task(['a', 'b', 'c']).run();
  },
  'arguments': function(test) {
    test.expect(1);
    this._test = test;
    this.t.task('a', 'b', 'c').run();
  },
  'exceptions': function(test) {
    test.expect(2);
    this._test = test;
    test.throws(function() { this.t.task('nonexistent'); }.bind(this), 'Queueing nonexistent tasks should throw an exception.');
    test.throws(function() { this.t.task('a', 'nonexistent'); }.bind(this), 'Queueing nonexistent tasks should throw an exception.');
    test.done();
  }
});

exports['this.task'] = testCase({
  setUp: function(done) {
    result = [];
    this.t = requireTask();
    this.t.done(function() {
      this._test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      this._test.done();
    }.bind(this));
    done();
  },
  'single': function(test) {
    test.expect(1);
    this._test = test;
    this.t.registerTask('a', function() { push(this); this.task('b').task('c'); });
    this.t.registerTask('b', function() { push(this); });
    this.t.registerTask('c', function() { push(this); });
    this.t.registerTask('d', function() { push(this); });
    this.t.task('a', 'd').run();
  },
  'array': function(test) {
    test.expect(1);
    this._test = test;
    this.t.registerTask('a', function() { push(this); this.task(['b', 'c']); });
    this.t.registerTask('b', function() { push(this); });
    this.t.registerTask('c', function() { push(this); });
    this.t.registerTask('d', function() { push(this); });
    this.t.task('a', 'd').run();
  },
  'arguments': function(test) {
    test.expect(1);
    this._test = test;
    this.t.registerTask('a', function() { push(this); this.task('b', 'c'); });
    this.t.registerTask('b', function() { push(this); });
    this.t.registerTask('c', function() { push(this); });
    this.t.registerTask('d', function() { push(this); });
    this.t.task('a', 'd').run();
  },
  'exceptions': function(test) {
    test.expect(1);
    this.t.registerTask('b', function() {
      test.throws(function() { this.task('nonexistent'); }.bind(this), 'Queueing nonexistent tasks should throw an exception.');
    });
    this.t.done(test.done);
    this.t.task('b').run();
  }
});

exports['helper'] = testCase({
  setUp: function(done) {
    result = [];
    this.t = requireTask();
    done();
  },
  'return': function(test) {
    this.t.registerHelper('test', function() { return 'a'; });
    test.strictEqual(this.t.helper('test'), 'a', 'helpers should return properly.');
    test.done();
  },
  'arguments': function(test) {
    this.t.registerHelper('test', function(x, y) { return x + y; });
    test.strictEqual(this.t.helper('test', 'b', 'c'), 'bc', 'helpers should receive arguments.');
    test.done();
  },
  'this': function(test) {
    this.t.registerHelper('test', function() { return this; });
    test.strictEqual(this.t.helper('test'), this.t, 'helpers should have `this` set properly.');
    test.done();
  },
  'exception': function(test) {
    test.throws(function() { this.helper('nonexistent'); }.bind(this), 'Calling nonexistent helpers should throw an exception.');
    test.done();
  }
});

exports['this.helper'] = testCase({
  setUp: function(done) {
    result = [];
    this.t = requireTask();
    done();
  },
  'return': function(test) {
    test.expect(1);
    this.t.registerTask('task', function() { result.push(this.helper('helper')); });
    this.t.registerHelper('helper', function() { return 'a'; });
    this.t.done(function() {
      test.strictEqual(result[0], 'a', 'helpers should return properly.');
      test.done();
    });
    this.t.task('task').run();
  },
  'arguments': function(test) {
    test.expect(1);
    this.t.registerTask('task', function() { result.push(this.helper('helper', 'b', 'c')); });
    this.t.registerHelper('helper', function(x, y) { return x + y; });
    this.t.done(function() {
      test.strictEqual(result[0], 'bc', 'helpers should receive arguments.');
      test.done();
    });
    this.t.task('task').run();
  },
  'this': function(test) {
    test.expect(1);
    this.t.registerTask('task', function() { result.push(this.helper('helper')); });
    this.t.registerHelper('helper', function() { return this.name; });
    this.t.done(function() {
      test.strictEqual(result[0], 'task', 'helpers should have `this` set properly.');
      test.done();
    }.bind(this));
    this.t.task('task').run();
  },
  'exception': function(test) {
    test.expect(1);
    this.t.registerTask('task', function() {
      test.throws(function() { this.helper('nonexistent'); }.bind(this), 'Calling nonexistent helpers should throw an exception.');
    });
    this.t.done(function() {
      test.done();
    });
    this.t.task('task').run();
  }
});

exports['synchronous tasks'] = testCase({
  setUp: function(done) {
    result = [];
    this.t = requireTask();
    done();
  },
  'basic': function(test) {
    test.expect(1);
    this.t.registerTask('a', function() { push(this); });
    this.t.registerTask('b', function() { push(this); });
    this.t.registerTask('c', function() { push(this); });
    this.t.done(function() {
      test.deepEqual(result.join(''), 'abc', 'tests should run in-order.');
      test.done();
    });
    this.t.task('a', 'b', 'c').run();
  },
  'complex: single nested tasks per task': function(test) {
    test.expect(1);
    this.t.registerTask('a', function() { push(this); this.task('b'); });
    this.t.registerTask('b', function() { push(this); this.task('c'); });
    this.t.registerTask('c', function() { push(this); });
    this.t.registerTask('d', function() { push(this); });
    this.t.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    this.t.task('a', 'd').run();
  },
  'complex: multiple nested tasks per task': function(test) {
    test.expect(1);
    this.t.registerTask('a', function() { push(this); this.task('b', 'c'); });
    this.t.registerTask('b', function() { push(this); });
    this.t.registerTask('c', function() { push(this); });
    this.t.registerTask('d', function() { push(this); });
    this.t.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    this.t.task('a', 'd').run();
  },
  'complex: multiple nested tasks in multiple tasks': function(test) {
    test.expect(1);
    this.t.registerTask('a', function() { push(this); this.task('b', 'g'); });
    this.t.registerTask('b', function() { push(this); this.task('c', 'd'); });
    this.t.registerTask('c', function() { push(this); });
    this.t.registerTask('d', function() { push(this); this.task('e', 'f'); });
    this.t.registerTask('e', function() { push(this); });
    this.t.registerTask('f', function() { push(this); });
    this.t.registerTask('g', function() { push(this); });
    this.t.registerTask('h', function() { push(this); });
    this.t.done(function() {
      test.deepEqual(result.join(''), 'abcdefgh', 'tests should run in-order.');
      test.done();
    });
    this.t.task('a', 'h').run();
  }
});

exports['asynchronous tasks'] = testCase({
  setUp: function(done) {
    result = [];
    this.t = requireTask();
    done();
  },
  'basic': function(test) {
    test.expect(1);
    this.t.registerTask('a', function() { push(this); delay(this.async()); });
    this.t.registerTask('b', function() { push(this); });
    this.t.registerTask('c', function() { push(this); delay(this.async()); });
    this.t.done(function() {
      test.deepEqual(result.join(''), 'abc', 'tests should run in-order.');
      test.done();
    });
    this.t.task('a', 'b', 'c').run();
  },
  'complex: single nested tasks per task': function(test) {
    test.expect(1);
    this.t.registerTask('a', function() { push(this); delay(this.async()); this.task('b'); });
    this.t.registerTask('b', function() { push(this); this.task('c'); delay(this.async()); });
    this.t.registerTask('c', function() { push(this); });
    this.t.registerTask('d', function() { push(this); });
    this.t.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    this.t.task('a', 'd').run();
  },
  'complex: multiple nested tasks per task': function(test) {
    test.expect(1);
    this.t.registerTask('a', function() { push(this); delay(this.async()); this.task('b', 'c'); });
    this.t.registerTask('b', function() { push(this); });
    this.t.registerTask('c', function() { push(this); delay(this.async()); });
    this.t.registerTask('d', function() { push(this); });
    this.t.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    this.t.task('a', 'd').run();
  },
  'complex: multiple nested tasks in multiple tasks': function(test) {
    test.expect(1);
    this.t.registerTask('a', function() { push(this); delay(this.async()); this.task('b', 'g'); });
    this.t.registerTask('b', function() { push(this); this.task('c', 'd'); });
    this.t.registerTask('c', function() { push(this); });
    this.t.registerTask('d', function() { push(this); this.task('e', 'f'); delay(this.async()); });
    this.t.registerTask('e', function() { push(this); });
    this.t.registerTask('f', function() { push(this); delay(this.async()); });
    this.t.registerTask('g', function() { push(this); });
    this.t.registerTask('h', function() { push(this); delay(this.async()); });
    this.t.done(function() {
      test.deepEqual(result.join(''), 'abcdefgh', 'tests should run in-order.');
      test.done();
    });
    this.t.task('a', 'h').run();
  }
});
