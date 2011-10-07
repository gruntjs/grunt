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
    var task = this.task = requireTask();
    task.registerTask('a', function() { push(this); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.done(function() {
      this._test.deepEqual(result.join(''), 'abc', 'tests should run in-order.');
      this._test.done();
    }.bind(this));
    done();
  },
  'single, chaining': function(test) {
    test.expect(1);
    this._test = test;
    this.task.run('a').run('b').run('c').start();
  },
  'array': function(test) {
    test.expect(1);
    this._test = test;
    this.task.run(['a', 'b', 'c']).start();
  },
  'arguments': function(test) {
    test.expect(1);
    this._test = test;
    this.task.run('a', 'b', 'c').start();
  },
  'multiple task string': function(test) {
    test.expect(1);
    this._test = test;
    this.task.run('a b c').start();
  },
  'exceptions': function(test) {
    test.expect(2);
    this._test = test;
    var task = this.task;
    test.throws(function() { task.run('nonexistent'); }, 'Queueing nonexistent tasks should throw an exception.');
    test.throws(function() { task.run('a', 'nonexistent'); }, 'Queueing nonexistent tasks should throw an exception.');
    test.done();
  }
});

exports['this.task'] = testCase({
  setUp: function(done) {
    result = [];
    var task = this.task = requireTask();
    task.done(function() {
      this._test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      this._test.done();
    }.bind(this));
    done();
  },
  'single, chaining': function(test) {
    test.expect(1);
    var task = this.task;
    this._test = test;
    task.registerTask('a', function() { push(this); task.run('b').run('c'); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); });
    task.run('a d').start();
  },
  'array': function(test) {
    test.expect(1);
    var task = this.task;
    this._test = test;
    task.registerTask('a', function() { push(this); task.run(['b', 'c']); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); });
    task.run('a d').start();
  },
  'arguments': function(test) {
    test.expect(1);
    var task = this.task;
    this._test = test;
    task.registerTask('a', function() { push(this); task.run('b', 'c'); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); });
    task.run('a d').start();
  },
  'multiple task string': function(test) {
    test.expect(1);
    var task = this.task;
    this._test = test;
    task.registerTask('a', function() { push(this); task.run('b c'); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); });
    task.run('a d').start();
  },
  'exceptions': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('b', function() {
      test.throws(function() { task.run('nonexistent'); }, 'Queueing nonexistent tasks should throw an exception.');
    });
    task.done(test.done);
    task.run('b').start();
  }
});

exports['this.parseArgs'] = testCase({
  setUp: function(done) {
    var task = requireTask();
    this.parseTest = function() {
      return task.parseArgs(arguments);
    };
    done();
  },
  'single task string': function(test) {
    test.expect(1);
    test.deepEqual(this.parseTest('foo'), ['foo'], 'string should be converted to array.');
    test.done();
  },
  'multiple task string': function(test) {
    test.expect(1);
    test.deepEqual(this.parseTest('foo bar baz'), ['foo', 'bar', 'baz'], 'string should be converted to array.');
    test.done();
  },
  'arguments': function(test) {
    test.expect(1);
    test.deepEqual(this.parseTest('foo', 'bar', 'baz'), ['foo', 'bar', 'baz'], 'arguments should be converted to array.');
    test.done();
  },
  'array': function(test) {
    test.expect(1);
    test.deepEqual(this.parseTest(['foo', 'bar', 'baz']), ['foo', 'bar', 'baz'], 'passed array should be used.');
    test.done();
  },
  'nothing': function(test) {
    test.expect(1);
    test.deepEqual(this.parseTest(), [], 'should return an empty array if nothing passed.');
    test.done();
  }
});

exports['this.superTask'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'simple': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { result.push(3); push(this); });
    task.registerTask('b', function() { result.push(2); push(this); });
    task.registerTask('a', function() { result.push(1); push(this); this.run('b'); this.superTask(); });
    task.done(function() {
      test.deepEqual(result.join(''), '1a2b3a', 'overriden test should be callable as this.superTask.');
      test.done();
    });
    task.run('a').start();
  },
  'less simple': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { result.push(2); push(this); });
    task.registerTask('b', function() { result.push(5); push(this); });
    task.registerTask('c', function() { result.push(4); push(this); });
    task.registerTask('a', function() { result.push(1); push(this); this.superTask(); task.run('b'); });
    task.registerTask('b', function() { result.push(3); push(this); task.run('c'); this.superTask(); });
    task.done(function() {
      test.deepEqual(result.join(''), '1a2a3b4c5b', 'overriden test should be callable as this.superTask.');
      test.done();
    });
    task.run('a').start();
  }
});

exports['this.failed'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'simple': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); return false; });
    this.task.registerTask('b', function() { push(this); delay(this.async().bind(this, false)); });
    this.task.registerTask('c', function() { push(this); });
    this.task.registerTask('d', function() { push(this); delay(this.async()); });
    this.task.registerTask('e', function() { if (this.failed('a')) { return; } push(this); });
    this.task.registerTask('f', function() { if (this.failed('b')) { return; } push(this); });
    this.task.registerTask('g', function() { if (this.failed('c')) { return; } push(this); });
    this.task.registerTask('h', function() { if (this.failed('d')) { return; } push(this); });
    this.task.registerTask('i', function() { if (this.failed('a c d')) { return; } push(this); });
    this.task.registerTask('j', function() { if (this.failed('c d')) { return; } push(this); });
    this.task.registerTask('k', function() { if (this.failed('nonexistent')) { return; } push(this); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abcdghjk', 'should be able to test if test(s) have failed.');
      test.done();
    });
    this.task.run('a b c d e f g h i j k').start();
  }
});

exports['this.succeeded'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'simple': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); return false; });
    this.task.registerTask('b', function() { push(this); delay(this.async().bind(this, false)); });
    this.task.registerTask('c', function() { push(this); });
    this.task.registerTask('d', function() { push(this); delay(this.async()); });
    this.task.registerTask('e', function() { if (!this.succeeded('a')) { return; } push(this); });
    this.task.registerTask('f', function() { if (!this.succeeded('b')) { return; } push(this); });
    this.task.registerTask('g', function() { if (!this.succeeded('c')) { return; } push(this); });
    this.task.registerTask('h', function() { if (!this.succeeded('d')) { return; } push(this); });
    this.task.registerTask('i', function() { if (!this.succeeded('a c d')) { return; } push(this); });
    this.task.registerTask('j', function() { if (!this.succeeded('c d')) { return; } push(this); });
    this.task.registerTask('k', function() { if (!this.succeeded('nonexistent')) { return; } push(this); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abcdghj', 'should be able to test if test(s) have succeeded.');
      test.done();
    });
    this.task.run('a b c d e f g h i j k').start();
  }
});

exports['helper'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'return': function(test) {
    this.task.registerHelper('test', function() { return 'a'; });
    test.strictEqual(this.task.helper('test'), 'a', 'helpers should return properly.');
    test.done();
  },
  'arguments': function(test) {
    this.task.registerHelper('test', function(x, y) { return x + y; });
    test.strictEqual(this.task.helper('test', 'b', 'c'), 'bc', 'helpers should receive arguments.');
    test.done();
  },
  'this': function(test) {
    this.task.registerHelper('test', function() { return this; });
    test.strictEqual(this.task.helper('test'), this.task, 'helpers should have `this` set properly.');
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
    this.task = requireTask();
    done();
  },
  'return': function(test) {
    test.expect(1);
    this.task.registerTask('task', function() { result.push(this.helper('helper')); });
    this.task.registerHelper('helper', function() { return 'a'; });
    this.task.done(function() {
      test.strictEqual(result[0], 'a', 'helpers should return properly.');
      test.done();
    });
    this.task.run('task').start();
  },
  'arguments': function(test) {
    test.expect(1);
    this.task.registerTask('task', function() { result.push(this.helper('helper', 'b', 'c')); });
    this.task.registerHelper('helper', function(x, y) { return x + y; });
    this.task.done(function() {
      test.strictEqual(result[0], 'bc', 'helpers should receive arguments.');
      test.done();
    });
    this.task.run('task').start();
  },
  'this': function(test) {
    test.expect(1);
    this.task.registerTask('task', function() { result.push(this.helper('helper')); });
    this.task.registerHelper('helper', function() { return this.name; });
    this.task.done(function() {
      test.strictEqual(result[0], 'task', 'helpers should have `this` set properly.');
      test.done();
    }.bind(this));
    this.task.run('task').start();
  },
  'exception': function(test) {
    test.expect(1);
    this.task.registerTask('task', function() {
      test.throws(function() { this.helper('nonexistent'); }.bind(this), 'Calling nonexistent helpers should throw an exception.');
    });
    this.task.done(function() {
      test.done();
    });
    this.task.run('task').start();
  }
});

exports['synchronous tasks'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'basic': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); });
    this.task.registerTask('b', function() { push(this); });
    this.task.registerTask('c', function() { push(this); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abc', 'tests should run in-order.');
      test.done();
    });
    this.task.run('a b c').start();
  },
  'complex: single nested tasks per task': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); this.run('b'); });
    this.task.registerTask('b', function() { push(this); this.run('c'); });
    this.task.registerTask('c', function() { push(this); });
    this.task.registerTask('d', function() { push(this); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    this.task.run('a d').start();
  },
  'complex: multiple nested tasks per task': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); this.run('b', 'c'); });
    this.task.registerTask('b', function() { push(this); });
    this.task.registerTask('c', function() { push(this); });
    this.task.registerTask('d', function() { push(this); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    this.task.run('a d').start();
  },
  'complex: multiple nested tasks in multiple tasks': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); this.run('b', 'g'); });
    this.task.registerTask('b', function() { push(this); this.run('c', 'd'); });
    this.task.registerTask('c', function() { push(this); });
    this.task.registerTask('d', function() { push(this); this.run('e', 'f'); });
    this.task.registerTask('e', function() { push(this); });
    this.task.registerTask('f', function() { push(this); });
    this.task.registerTask('g', function() { push(this); });
    this.task.registerTask('h', function() { push(this); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abcdefgh', 'tests should run in-order.');
      test.done();
    });
    this.task.run('a h').start();
  }
});

exports['asynchronous tasks'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'basic': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); delay(this.async()); });
    this.task.registerTask('b', function() { push(this); });
    this.task.registerTask('c', function() { push(this); delay(this.async()); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abc', 'tests should run in-order.');
      test.done();
    });
    this.task.run('a b c').start();
  },
  'complex: single nested tasks per task': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); delay(this.async()); this.run('b'); });
    this.task.registerTask('b', function() { push(this); this.run('c'); delay(this.async()); });
    this.task.registerTask('c', function() { push(this); });
    this.task.registerTask('d', function() { push(this); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    this.task.run('a d').start();
  },
  'complex: multiple nested tasks per task': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); delay(this.async()); this.run('b', 'c'); });
    this.task.registerTask('b', function() { push(this); });
    this.task.registerTask('c', function() { push(this); delay(this.async()); });
    this.task.registerTask('d', function() { push(this); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    this.task.run('a d').start();
  },
  'complex: multiple nested tasks in multiple tasks': function(test) {
    test.expect(1);
    this.task.registerTask('a', function() { push(this); delay(this.async()); this.run('b', 'g'); });
    this.task.registerTask('b', function() { push(this); this.run('c', 'd'); });
    this.task.registerTask('c', function() { push(this); });
    this.task.registerTask('d', function() { push(this); this.run('e', 'f'); delay(this.async()); });
    this.task.registerTask('e', function() { push(this); });
    this.task.registerTask('f', function() { push(this); delay(this.async()); });
    this.task.registerTask('g', function() { push(this); });
    this.task.registerTask('h', function() { push(this); delay(this.async()); });
    this.task.done(function() {
      test.deepEqual(result.join(''), 'abcdefgh', 'tests should run in-order.');
      test.done();
    });
    this.task.run('a h').start();
  }
});
