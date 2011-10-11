var testCase = require('nodeunit').testCase;

// Test helpers.
function push(t) { result.push(t.name); }
function delay(fn) { setTimeout(fn, 10); }

var result = (function() {
  var arr;
  var push = function(val) { arr.push(val); }
  return {
    reset: function() { arr = []; },
    push: push,
    pushTaskname: function() { push(this.name); },
    get: function() { return arr; },
    getJoined: function() { return arr.join(''); }
  };
}());

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
    this.task.registerHelper('add', this.fn);
    done();
  },
  'Task#registerHelper': function(test) {
    test.expect(1);
    var task = this.task;
    test.ok('add' in task._helpers, 'It should register the passed helper.');
    test.done();
  },
  'Task#helper': function(test) {
    test.expect(2);
    var task = this.task;
    test.strictEqual(task.helper('add', 1, 2), 3, 'It should receive arguments and return a value.');
    test.throws(function() { task.helper('nonexistent'); }, 'Attempting to execute unregistered handlers should throw an exception.');
    test.done();
  },
  'Task#renameHelper': function(test) {
    test.expect(4);
    var task = this.task;
    task.renameHelper('add', 'newadd');
    test.ok('newadd' in task._helpers, 'It should rename the specified helper.');
    test.equal('add' in task._helpers, false, 'It should remove the previous helper name.');
    test.doesNotThrow(function() { task.helper('newadd'); }, 'It should be accessible by its new name.');
    test.throws(function() { task.helper('add'); }, 'It should not be accessible by its previous name.');
    test.done();
  }
});

exports['Tasks'] = testCase({
  setUp: function(done) {
    this.task = requireTask().create();
    var task = this.task;
    task.registerTask('nothing', 'Do nothing.', function() {});
    done();
  },
  'Task#registerTask': function(test) {
    test.expect(1);
    var task = this.task;
    test.ok('nothing' in task._tasks, 'It should register the passed task.');
    test.done();
  },
  'Task#run (exception handling)': function(test) {
    test.expect(2);
    var task = this.task;
    test.doesNotThrow(function() { task.run('nothing'); }, 'Registered tasks should be runnable.');
    test.throws(function() { task.run('nonexistent'); }, 'Attempting to run unregistered tasks should throw an exception.');
    test.done();
  },
  'Task#run (nested, exception handling)': function(test) {
    test.expect(2);
    var task = this.task;
    result.reset();
    task.registerTask('yay', 'Run a registered task.', function() {
      test.doesNotThrow(function() { task.run('nothing'); }, 'Registered tasks should be runnable.');
    });
    task.registerTask('nay', 'Attempt to run an unregistered task.', function() {
      test.throws(function() { task.run('nonexistent'); }, 'Attempting to run unregistered tasks should throw an exception.');
    });
    task.options({
      done: test.done
    });
    task.run('yay nay').start();
  },
  'Task#run (arguments, queue order)': function(test) {
    test.expect(1);
    var task = this.task;
    result.reset();
    task.registerTask('a', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('b', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('c', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('d', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('e', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('f', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('g', 'Push task name onto result.', result.pushTaskname);
    task.options({
      done: function() {
        test.strictEqual(result.getJoined(), 'abcdefg', 'The specified tasks should have run, in-order.');
        test.done();
      }
    });
    task.run('a').run('b', 'c').run(['d', 'e']).run('f g').start();
  },
  'Task#run (nested tasks, queue order)': function(test) {
    test.expect(1);
    var task = this.task;
    result.reset();
    task.registerTask('a', 'Push task name onto result and run other tasks.', function() { result.push(this.name); task.run('b e'); });
    task.registerTask('b', 'Push task name onto result and run other tasks.', function() { result.push(this.name); task.run('c d'); });
    task.registerTask('c', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('d', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('e', 'Push task name onto result and run other tasks.', function() { result.push(this.name); task.run('f'); });
    task.registerTask('f', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('g', 'Push task name onto result.', result.pushTaskname);
    task.options({
      done: function() {
        test.strictEqual(result.getJoined(), 'abcdefg', 'The specified tasks should have run, in-order.');
        test.done();
      }
    });
    task.run('a g').start();
  },
  'Task#run (async, nested tasks, queue order)': function(test) {
    test.expect(1);
    var task = this.task;
    result.reset();
    task.registerTask('a', 'Push task name onto result and run other tasks.', function() { result.push(this.name); task.run('b e'); delay(this.async()); });
    task.registerTask('b', 'Push task name onto result and run other tasks.', function() { result.push(this.name); delay(this.async()); task.run('c d'); });
    task.registerTask('c', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('d', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('e', 'Push task name onto result and run other tasks.', function() { delay(this.async()); result.push(this.name); task.run('f'); });
    task.registerTask('f', 'Push task name onto result.', result.pushTaskname);
    task.registerTask('g', 'Push task name onto result.', result.pushTaskname);
    task.options({
      done: function() {
        test.strictEqual(result.getJoined(), 'abcdefg', 'The specified tasks should have run, in-order.');
        test.done();
      }
    });
    task.run('a g').start();
  },
  'Task#requires': function(test) {
    test.expect(1);
    var task = this.task;
    result.reset();
    task.registerTask('a', 'Push task name onto result, but fail.', function() {
      result.push(this.name);
      return false;
    });
    task.registerTask('b', 'Push task name onto result, but fail.', function() {
      delay(this.async().bind(this, false));
      result.push(this.name);
    });
    task.registerTask('c', 'Succeed.', result.pushTaskname);
    task.registerTask('d', 'Succeed.', result.pushTaskname);
    task.registerTask('e', 'Fail because a required task has failed.', function() {
      task.requires('a c d');
      result.push(this.name);
    });
    task.registerTask('f', 'Fail because a required task has failed.', function() {
      task.requires('b c d');
      result.push(this.name);
    });
    task.registerTask('g', 'Succeed because all required tasks have succeeded.', function() {
      task.requires('c d');
      result.push(this.name);
    });
    task.options({
      done: function() {
        test.strictEqual(result.getJoined(), 'abcdg', 'Tasks whose requirements have failed should not run.');
        test.done();
      }
    });
    task.run('a b c d e f g').start();
  },
});








