var testCase = require('nodeunit').testCase;

// Test helpers.
function push(t) { result.push(t.name); }
function delay(fn) { setTimeout(fn, 10); }

var result;
var resetResult = function() { result = []; };
var pushTaskName = function() { result.push(this.name); };
var requireTask = require.bind(this, '../../lib/util/task.js');

exports['new Task'] = testCase({
  'create': function(test) {
    test.expect(1);
    var tasklib = requireTask();
    test.ok(tasklib.create() instanceof tasklib.Task, 'It should return a Task instance.');
    test.done();
  }
});

exports['Helpers'] = testCase({
  setUp: function(done) {
    this.task = requireTask().create();
    this.fn = function(a, b) { return a + b; };
    this.task.registerHelper('adder', this.fn);
    done();
  },
  'Task#registerHelper': function(test) {
    test.expect(1);
    var task = this.task;
    test.strictEqual(task.helpers['adder'], this.fn, 'It should register the passed helper.');
    test.done();
  },
  'Task#helper': function(test) {
    test.expect(2);
    var task = this.task;
    test.strictEqual(task.helper('adder', 1, 2), 3, 'It should receive arguments and return a value.');
    test.throws(function() { task.helper('nonexistent'); }, 'Attempting to access unregistered handlers should throw an exception.');
    test.done();
  },
  'Task#renameHelper': function(test) {
    test.expect(3);
    var task = this.task;
    task.renameHelper('adder', 'newadder');
    test.strictEqual(task.helpers['newadder'], this.fn, 'It should rename the specified helper.');
    test.throws(function() { task.helper('adder'); }, 'It should not be accessible by its previous name.');
    test.doesNotThrow(function() { task.helper('newadder'); }, 'It should be accessible by its new name.');
    test.done();
  }
});


exports['Task#run'] = testCase({
  setUp: function(done) {
    result = [];
    var task = this.task = requireTask();
    task.registerTask('a', function() { push(this); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function(arg) { push(this); result.push(arg || '1'); });
    task.registerTask('d:e', function(arg) { push(this); result.push('2', arg); });
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
  'arguments': function(test) {
    test.expect(1);
    this._test = test;
    var task = this.task;
    task.done(function() {
      test.deepEqual(result.join(''), 'abcd1d2edf', 'tests should run in-order.');
      test.done();
    });
    this.task.run('d d:e d:f').start();
  },
  'exceptions': function(test) {
    test.expect(2);
    this._test = test;
    var task = this.task;
    test.throws(function() { task.run('nonexistent'); }, 'Queueing nonexistent tasks should throw an exception.');
    test.throws(function() { task.run('a nonexistent b'); }, 'Queueing nonexistent tasks should throw an exception.');
    test.done();
  }
});

exports['Task#run (inside tasks)'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'multiple task string': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); task.run('b c'); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
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

exports['Task#parseArgs'] = testCase({
  setUp: function(done) {
    var task = requireTask();
    this.parseTest = function() {
      return task.parseArgs(arguments);
    };
    done();
  },
  'single task string': function(test) {
    test.expect(1);
    test.deepEqual(this.parseTest('foo'), ['foo'], 'string should be split into array.');
    test.done();
  },
  'multiple task string': function(test) {
    test.expect(1);
    test.deepEqual(this.parseTest('foo bar baz'), ['foo', 'bar', 'baz'], 'string should be split into array.');
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
  'object': function(test) {
    test.expect(1);
    var obj = {};
    test.deepEqual(this.parseTest(obj), [obj], 'single object should be returned as array.');
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
    task.registerTask('a', function() { result.push(1); push(this); task.run('b'); this.superTask(); });
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

exports['Task#failed'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'simple': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); return false; });
    task.registerTask('b', function() { push(this); var done = this.async(); delay(function() { done(false); }); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); delay(this.async()); });
    task.registerTask('e', function() { if (task.failed('a')) { return; } push(this); });
    task.registerTask('f', function() { if (task.failed('b')) { return; } push(this); });
    task.registerTask('g', function() { if (task.failed('c')) { return; } push(this); });
    task.registerTask('h', function() { if (task.failed('d')) { return; } push(this); });
    task.registerTask('i', function() { if (task.failed('a c d')) { return; } push(this); });
    task.registerTask('j', function() { if (task.failed('c d')) { return; } push(this); });
    task.registerTask('k', function() { if (task.failed('nonexistent')) { return; } push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcdghjk', 'should be able to test if test(s) have failed.');
      test.done();
    });
    task.run('a b c d e f g h i j k').start();
  }
});

exports['Task#succeeded'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'simple': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); return false; });
    task.registerTask('b', function() { push(this); delay(this.async().bind(this, false)); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); delay(this.async()); });
    task.registerTask('e', function() { if (!task.succeeded('a')) { return; } push(this); });
    task.registerTask('f', function() { if (!task.succeeded('b')) { return; } push(this); });
    task.registerTask('g', function() { if (!task.succeeded('c')) { return; } push(this); });
    task.registerTask('h', function() { if (!task.succeeded('d')) { return; } push(this); });
    task.registerTask('i', function() { if (!task.succeeded('a c d')) { return; } push(this); });
    task.registerTask('j', function() { if (!task.succeeded('c d')) { return; } push(this); });
    task.registerTask('k', function() { if (!task.succeeded('nonexistent')) { return; } push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcdghj', 'should be able to test if test(s) have succeeded.');
      test.done();
    });
    task.run('a b c d e f g h i j k').start();
  }
});

exports['Task#fn'] = testCase({
  setUp: function(done) {
    result = [];
    var task = this.task = requireTask();
    task.registerTask('a', function() { push(this); });
    task.registerTask('b', function() { push(this); delay(this.async()); });
    task.registerTask('c', 'a b');
    done();
  },
  'simple': function(test) {
    test.expect(1);
    var task = this.task;
    task.done(function() {
      test.deepEqual(result.join(''), 'ab', 'should be able to create a shortcut for tasks.');
      test.done();
    });
    task.run('c').start();
  }
});

exports['Task#helper'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'return': function(test) {
    var task = this.task;
    task.registerHelper('test', function() { return 'a'; });
    test.strictEqual(task.helper('test'), 'a', 'helpers should return properly.');
    test.done();
  },
  'arguments': function(test) {
    var task = this.task;
    task.registerHelper('test', function(x, y) { return x + y; });
    test.strictEqual(task.helper('test', 'b', 'c'), 'bc', 'helpers should receive arguments.');
    test.done();
  },
  'this': function(test) {
    var task = this.task;
    task.registerHelper('test', function() { return this; });
    test.strictEqual(task.helper('test'), task, 'helpers should have `this` set properly.');
    test.done();
  },
  'exception': function(test) {
    var task = this.task;
    test.throws(function() { task.helper('nonexistent'); }, 'Calling nonexistent helpers should throw an exception.');
    test.done();
  }
});

exports['synchronous'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'basic': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abc', 'tests should run in-order.');
      test.done();
    });
    task.run('a b c').start();
  },
  'complex: single nested tasks per task': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); task.run('b'); });
    task.registerTask('b', function() { push(this); task.run('c'); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    task.run('a d').start();
  },
  'complex: multiple nested tasks per task': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); task.run('b c'); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    task.run('a d').start();
  },
  'complex: multiple nested tasks in multiple tasks': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); task.run('b g'); });
    task.registerTask('b', function() { push(this); task.run('c d'); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); task.run('e f'); });
    task.registerTask('e', function() { push(this); });
    task.registerTask('f', function() { push(this); });
    task.registerTask('g', function() { push(this); });
    task.registerTask('h', function() { push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcdefgh', 'tests should run in-order.');
      test.done();
    });
    task.run('a h').start();
  }
});

exports['this.async'] = testCase({
  setUp: function(done) {
    result = [];
    this.task = requireTask();
    done();
  },
  'basic': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); delay(this.async()); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); delay(this.async()); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abc', 'tests should run in-order.');
      test.done();
    });
    task.run('a b c').start();
  },
  'complex: single nested tasks per task': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); delay(this.async()); task.run('b'); });
    task.registerTask('b', function() { push(this); task.run('c'); delay(this.async()); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    task.run('a d').start();
  },
  'complex: multiple nested tasks per task': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); delay(this.async()); task.run('b c'); });
    task.registerTask('b', function() { push(this); });
    task.registerTask('c', function() { push(this); delay(this.async()); });
    task.registerTask('d', function() { push(this); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcd', 'tests should run in-order.');
      test.done();
    });
    task.run('a d').start();
  },
  'complex: multiple nested tasks in multiple tasks': function(test) {
    test.expect(1);
    var task = this.task;
    task.registerTask('a', function() { push(this); delay(this.async()); task.run('b g'); });
    task.registerTask('b', function() { push(this); task.run('c d'); });
    task.registerTask('c', function() { push(this); });
    task.registerTask('d', function() { push(this); task.run('e f'); delay(this.async()); });
    task.registerTask('e', function() { push(this); });
    task.registerTask('f', function() { push(this); delay(this.async()); });
    task.registerTask('g', function() { push(this); });
    task.registerTask('h', function() { push(this); delay(this.async()); });
    task.done(function() {
      test.deepEqual(result.join(''), 'abcdefgh', 'tests should run in-order.');
      test.done();
    });
    task.run('a h').start();
  }
});
