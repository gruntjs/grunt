[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# Creating tasks

Tasks are grunt's bread and butter. The stuff you do most often, like `concat` or `test`. Every time grunt is run, you specify one more more tasks, which tells grunt what you'd like it to do.

_Note: if you don't specify a task, but a task named "default" has been defined, that task will run (unsurprisingly) by default._

Tasks can be created in a few ways.

## Alias tasks

```javascript
task.registerTask(taskName, [description, ] taskList);
```

_Note that for alias tasks, the description is optional. If omitted, a useful description will be added for you automatically._

In the following example, a `theworks` task is defined that, when invoked by `grunt theworks`, will execute the `lint`, `qunit`, `concat` and `min` tasks in-order. Running `grunt theworks` behaves exactly as if `grunt lint qunit concat min` was run on the command line.

```javascript
task.registerTask('theworks', 'lint qunit concat min');
```

In this example, a default task is defined that, when invoked by `grunt` or `grunt default`, will execute the `lint`, `qunit`, `concat` and `min` tasks in-order. It behaves exactly as if `grunt lint qunit concat min` was run on the command line.

```javascript
task.registerTask('default', 'lint qunit concat min');
```

_In case it's not obvious, defining a `default` task is helpful because it runs by default, whenever you run `grunt` without explicitly specifying tasks._

## Basic tasks
A basic task is a task that implicitly iterates over all of its targets if no target is specified. For example, in the following, while `grunt lint:test` or `grunt lint:lib` will lint only those specific sets of files, `grunt lint` will automatically run the `test`, `lib` and `grunt` targets for you. It's super convenient.

_Note: basic tasks will ignore any config sub-properties beginning with `_` (underscore)._

```javascript
/*global config:true, task:true*/
config.init({
  lint: {
    test: ['test/*.js'],
    lib: ['lib/*.js'],
    grunt: ['grunt.js']
  }
});
```

While it's probably most useful for you to check out the JavaScript source of the [built-in tasks](https://github.com/cowboy/grunt/tree/master/tasks), this example shows how you might define your own Basic task:

```javascript
/*global config:true, task:true*/
config.init({
  logstuff: {
    foo: [1, 2, 3],
    bar: 'hello world',
    baz: false
  }
});

task.registerBasicTask('logstuff', 'This task logs stuff.', function(data, name) {
  // data === the value of the target-specific sub-property
  // name === the name of the target-specific sub-property

  // Log some stuff.
  log.writeln(name + ': ' + data);

  // If data was falsy, abort!!
  if (!data) { return false; }
  log.writeln('Logging stuff succeeded.');
});
```

Sample grunt output from running `logstuff` targets individually:

```
$ grunt logstuff:foo
Running "logstuff:foo" (logstuff) task
foo: 1,2,3
Logging stuff succeeded.

Done, without errors.

$ grunt logstuff:bar
Running "logstuff:bar" (logstuff) task
bar: hello world
Logging stuff succeeded.

Done, without errors.

$ grunt logstuff:baz
Running "logstuff:baz" (logstuff) task
baz: false
<WARN> Task "logstuff:baz" failed. Use --force to continue. </WARN>

Aborted due to warnings.
```

Sample grunt output from running `logstuff` task:

```
$ grunt logstuff
Running "logstuff:foo" (logstuff) task
foo: 1,2,3
Logging stuff succeeded.

Running "logstuff:bar" (logstuff) task
bar: hello world
Logging stuff succeeded.

Running "logstuff:baz" (logstuff) task
baz: false
<WARN> Task "logstuff:baz" failed. Use --force to continue. </WARN>

Aborted due to warnings.
```

## Custom tasks
You can go crazy with tasks. They don't have to be basic. If your tasks don't follow the "basic task" structure, use a custom task.

```javascript
task.registerTask('default', 'My "default" task description.', function() {
  log.writeln('Currently running the "default" task.');
});
```

Inside a task, you can run other tasks.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  // Enqueue "bar" and "baz" tasks, to run after "foo" finishes, in-order.
  task.run('bar baz');
  // Or:
  task.run(['bar', 'baz']);
});
```

Tasks can be asynchronous.

```javascript
task.registerTask('asyncfoo', 'My "asyncfoo" task.', function() {
  // Force task into async mode and grab a handle to the "done" function.
  var done = this.async();
  // Run some sync stuff.
  log.writeln('Processing task...');
  // And some async stuff.
  setTimeout(function() {
    log.writeln('All done!');
    done();
  }, 1000);
});
```

Tasks can access their own name and arguments.

```javascript
task.registerTask('foo', 'My "foo" task.', function(a, b) {
  log.writeln(this.name, a, b);
});

// Usage:
// grunt foo foo:bar
//   logs: "foo", undefined, undefined
//   logs: "foo", "bar", undefined
// grunt foo:bar:baz
//   logs: "foo", "bar", "baz"
```

Tasks can fail if any errors were logged.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  if (failureOfSomeKind) {
    log.error('This is an error message.');
  }

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  log.writeln('This is the success message');
});
```

When tasks fail, all subsequent tasks will be aborted unless `--force` was specified.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  // Fail synchronously.
  return false;
});

task.registerTask('bar', 'My "bar" task.', function() {
  var done = this.async();
  setTimeout(function() {
    // Fail asynchronously.
    done(false);
  }, 1000);
});
```

Tasks can be dependent on the successful execution of other tasks. Note that `task.requires` won't actually RUN the other task(s). It'll just check to see that it has run and not failed.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  return false;
});

task.registerTask('bar', 'My "bar" task.', function() {
  // Fail task if "foo" task failed or never ran.
  task.requires('foo');
  // This code executes if the "foo" task ran successfully.
  log.writeln('Hello, world.');
});

// Usage:
// grunt foo bar
//   doesn't log, because foo failed.
// grunt bar
//   doesn't log, because foo never ran.
```

Tasks can fail if required configuration properties don't exist.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  // Fail task if "meta.name" config prop is missing.
  config.requires('meta.name');
  // Also fails if "meta.name" config prop is missing.
  config.requires(['meta', 'name']);
  // Log... conditionally.
  log.writeln('This will only log if meta.name is defined in the config.');
});
```

Tasks can access configuration properties.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  // Log the property value. Returns null if the property is undefined.
  log.writeln('The meta.name property is: ' + config('meta.name'));
  // Also logs the property value. Returns null if the property is undefined.
  log.writeln('The meta.name property is: ' + config(['meta', 'name']));
});
```

Take a look at the [built-in tasks](https://github.com/cowboy/grunt/tree/master/tasks) for more examples.
