# grunt

Grunt is a command line build tool for JavaScript projects.

As of now, grunt has the following predefined tasks.

 * **concat** - Concatenate files.
 * **lint** - Validate files with JSHint.
 * **min** - Minify files with UglifyJS.
 * **test** - Run unit tests.

More will be added as I find the time, but you can very easily define your own tasks in your gruntfile.

## Getting started

Once this is in npm it'll be a little easier, but for now, just clone and install grunt like this:

```bash
git clone git://github.com/cowboy/node-grunt.git && cd node-grunt && npm install && npm link
```

Once done, type `grunt --help` for help, or just `grunt` to see grunt "grunt" itself.

## The "gruntfile"

Create a `grunt.js` file at the root of your project's repo. Take a look at the [sample config files][configs].

There are really two parts to the `grunt.js` file. Initializing the configuration, and defining tasks and/or helpers.

## Configuration

The best thing, until the documentation is more fleshed out, would be to look at the [sample config files][configs], but here's a brief run-down:

```javascript
config.init({
  // Generic project information used by some helpers and tasks.
  meta: {},
  // Lists of files to be concatenated, used by the "concat" task.
  concat: {},
  // Lists of files to be minififed with UglifyJS, used by the "min" task.
  min: {},
  // Lists of files to be unit tested with Nodeunit, used by the "test" task.
  test: {},
  // Lists of files to be linted with JSHint, used by the "lint" task.
  lint: {},
  // Global configuration options for JSHint.
  jshint: {},
  // Global configuration options for UglifyJS.
  uglify: {}
});
```

_Note that you don't need to specify configuration settings for tasks that you don't use._

The "lists of files" tasks work something like this:

```javascript
config.init({
  // When the "concat:dist/output.js" task is run, the specified "foo.js" and
  // "bar.js" files will be concatenated in-order and saved to the "output.js"
  // output file. Note that if the "concat" task is run without an argument,
  // all sub-tasks (in this case, just the "concat:dist/output.js" sub-task)
  // will automatically be run.
  concat: {
    'dist/output.js': ['src/foo.js', 'src/bar.js']
  },
  lint: {
    // When the "lint:beforeconcat" task is run, the specified "foo.js" and
    // "bar.js" files will be linted with JSHint. The same follows for the
    // "lint:afterconcat" task. Note that if the "lint" task is run without an
    // argument, all sub-tasks (in this case, both the "lint:beforeconcat" and
    // "lint:afterconcat" sub-tasks) will automatically be run.
    beforeconcat: ['src/foo.js', 'src/bar.js'],
    afterconcat: ['dist/output.js']
  }
});
```

Of course, you probably don't want to type "grunt lint concat" every time you need to process your code. Why not create an alias?

## Tasks

The "default" task is one that will be executed by grunt if no task is explicitly specified on the command line. You can create any number of arbitrary task aliases, but the "default" task is a special case. And while you can specify a description for a task alias, grunt will add one for you if you don't, so don't bother.

```javascript
task.registerTask(taskName, [optionalDescription], taskFunctionOrAliasString);
```

This alias example is a little naive, because it tries to lint the "afterconcat" file before it's been created by the concat task.

```javascript
task.registerTask('default', 'lint concat');
```

A smarter solution would be to create an alias that executes tasks in a logical progression:

```javascript
task.registerTask('default', 'lint:beforeconcat concat lint:afterconcat');
```

Either way, just make sure you register a "default" task in your gruntfile.

A custom task can be created as-follows (and it doesn't have to be called "default" either).

```javascript
task.registerTask('default', 'My "default" task description.', function() {
  log.writeln('Currently running the "default" task.');
});
```

Inside a task, you can run other tasks.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  // Run "bar" and "baz" tasks, in-order.
  task.run('bar baz');
});
```

Tasks can be asynchronous.

```javascript
task.registerTask('async', 'My "foo" task.', function() {
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

Tasks can fail (causing all subsequent tasks to be aborted unless `--force` is used on the command line).

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

Tasks can be dependent on the successful execution of other tasks. Note that `task.requires` won't actually RUN the other task. It'll just check to see that it has run and not failed.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  return false;
});

task.registerTask('bar', 'My "bar" task.', function() {
  // Fail task if "foo" task failed or never ran.
  task.requires('foo');
  // Oops?
  log.writeln('Nope, not gonna happen.');
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
  // Log... conditionally.
  log.writeln('This will only log if meta.name is defined in the config.');
});
```

Tasks can access configuration properties.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  // Log the property value. Returns null if the property is undefined.
  log.writeln('The meta.name property is: ' + config('meta.name'));
});
```

Look at the [built-in tasks][tasks] for more examples.

## Helpers

_(more documentation coming soon)_






[configs]: https://github.com/cowboy/node-grunt/tree/master/template
[tasks]: https://github.com/cowboy/node-grunt/tree/master/lib/grunt/tasks
