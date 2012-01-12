# grunt
Grunt is a command line build tool for JavaScript projects.

As of now, grunt has the following predefined tasks:

 * **concat** - Concatenate files.
 * **lint** - Validate files with [JSHint][jshint].
 * **min** - Minify files with [UglifyJS][uglify].
 * **test** - Run unit tests with [nodeunit][nodeunit].
 * **watch** - Run predefined tasks whenever watched files change.

_(My TODO list includes a "project scaffolding" task as well as a "QUnit headless unit-testing" task)_

And in addition to the predefined tasks, you can define your own.

[issues]: https://github.com/cowboy/grunt/issues

[concat]: https://github.com/cowboy/grunt/blob/master/lib/grunt/tasks/concat.js
[lint]: https://github.com/cowboy/grunt/blob/master/lib/grunt/tasks/lint.js
[min]: https://github.com/cowboy/grunt/blob/master/lib/grunt/tasks/min.js
[test]: https://github.com/cowboy/grunt/blob/master/lib/grunt/tasks/test.js
[misc]: https://github.com/cowboy/grunt/blob/master/lib/grunt/tasks/misc.js
[tasks]: https://github.com/cowboy/grunt/tree/master/lib/grunt/tasks
[gruntfile]: https://github.com/cowboy/grunt/blob/master/grunt.js

[node]: http://nodejs.org/
[npm]: http://npmjs.org/
[jshint]: http://www.jshint.com/
[uglify]: https://github.com/mishoo/UglifyJS/
[nodeunit]: https://github.com/caolan/nodeunit

## Why does grunt exist?
Doing all this stuff manually is a total pain, and building all this stuff into a gigantic Makefile / Jakefile / Cakefile / Rakefile / ?akefile that's maintained across all my projects was also becoming a total pain. Since I always found myself performing the same tasks over and over again, for every project, it made sense to build a task-based build tool.

Being primarily a JavaScript developer, I decided to use [Node.js][node] and [npm][npm] because the dependencies I most care about ([JSHint][jshint] and [UglifyJS][uglify]) were already npm modules. That being said, while Node.js was designed to support highly-concurrent asynchronous-IO-driven web servers, it was clearly NOT designed to make command-line build tools. But none of that matters, because grunt works. Just install it and see.

## Installing grunt

_Grunt is currently in beta. While I'm already using it on multiple projects, it might have a minor issue or two. And things might change before its final release, based on your feedback. Please try it out in a project, and [make suggestions][issues] or [report bugs][issues]!_

Grunt is available as an [npm][npm] module. If you install grunt globally via `npm install -g grunt`, it will be available for use in all of your projects.

Once grunt has been installed, you can type `grunt --help` at the command line for more information. And if you want to see grunt "grunt" itself, cd into grunt's directory and type `grunt` (in Windows, you might need to run it as `grunt.cmd`).

## The config file, aka "gruntfile"
When run, grunt looks in the current directory for a file named `grunt.js`, and if not found, continues looking in parent directories until found. The gruntfile is typically placed in the root of your project repository, and is a valid JavaScript file comprised of two parts: [project configuration](#config), and [tasks](#tasks) / [helpers](#helpers).

<div id="config"></div>
## Project configuration
Each grunt task relies on configuration information defined in a single `config.init()` call in the gruntfile. Usually, this information is specified in task-named sub-properties of a main configuration object. It's not as complicated as it sounds.

For example, this simple configuration would define a list of files to be linted when the task "lint:files" was run on the command line like this: `grunt lint:files`.

```javascript
config.init({
  lint: {
    files: ['lib/*.js', 'test/*.js', 'grunt.js']
  }
});
```

Also note that because the "lint" task is a [basic task](#tasks_basic), you can also run _all_ lint sub-tasks with just `grunt lint`.

You can store any arbitrary information inside of the configuration object, and as long as it doesn't conflict with a property one of your tasks is using, it will be ignored.

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

Take a look at grunt's own [grunt.js gruntfile][gruntfile] or [javascript-hooker's gruntfile](https://github.com/cowboy/javascript-hooker/blob/master/grunt.js) or [glob-whatev's gruntfile](https://github.com/cowboy/node-glob-whatev/blob/master/grunt.js) for a few examples.

_Note: you don't need to specify configuration settings for tasks that you don't use._

<div id="tasks"></div>
## Tasks
Tasks are the things you do most often, like [concat][concat], [lint][lint], [min][min] or [test][test] files. Every time grunt is run, one or more tasks must be specified, which tells grunt what you want it to do. Note that if you don't specify a task, but a task named "default" has been defined, that task will run (unsurprisingly) by default.

_You should probably create a ["default" task][gruntfile] in your gruntfile._

Tasks can be created in a few ways.

<div id="tasks_alias"></div>
### Alias tasks

```javascript
task.registerTask(taskName, [description, ] taskList);
```

_Note that the description is optional. If omitted, a useful description will be added for you automatically._

The following example defines a task named "theworks" that, when run, actually runs the "lint:files" "test:files" "concat" "min" tasks, in-order. so instead of typing `grunt lint:files test:files concat min` at the command line, you can just type `grunt theworks`. If this task were named "default" instead of "theworks" it would be run by default whenever `grunt` was executed without specifying tasks.

```javascript
task.registerTask('theworks', 'lint:files test:files concat min');
```

<div id="tasks_basic"></div>
### Basic tasks
A basic task is a task that implicitly iterates over all of its configuration sub-properties if no sub-task is specified. For example, in the following, while `grunt lint:test` or `grunt lint:lib` will lint only those specific files, `grunt lint` will run the "test", "lib" and "grunt" sub-tasks for you, automatically. It's convenient.

```javascript
config.init({
  lint: {
    test: ['test/*.js'],
    lib: ['lib/*.js'],
    grunt: ['grunt.js']
  }
});
```

While it's probably more useful for you to check out the JavaScript source of the [concat][concat], [lint][lint], [min][min] or [test][test] tasks, this is how you'd define a Basic task:

```javascript
task.registerBasicTask('log', 'This task logs something.', function(data, name) {
  // data === the value of the config sub-prop
  // name === the name of the config sub-prop

  log.writeln(data);

  if (failureOfSomeKind) { return false; }
  log.writeln('Your success message.');
});
```

<div id="tasks_custom"></div>
### Custom tasks

You can go crazy with tasks, though. They don't have to be basic.

```javascript
task.registerTask('default', 'My "default" task description.', function() {
  log.writeln('Currently running the "default" task.');
});
```

Inside a task, you can run other tasks.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  // Enqueue "bar" and "baz" tasks, to run after 'foo' finishes, in-order.
  task.run('bar baz');
  // Or:
  task.run(['bar', 'baz']);
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

Tasks can fail if any errors were logged.

```javascript
task.registerTask('foo', 'My "foo" task.', function() {
  if (someError) {
    log.error('This is an error message.');
  }

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  log.writeln('This is the success message');
});
```

When tasks fail, all subsequent tasks will be aborted unless `--force` is specified.

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

Look at the [built-in tasks][tasks] for more examples.

## Helpers
Helpers are just utility functions, exposed through the `task` global variable, so that they can be used by tasks in other files.

It's not much more complex than this:

```javascript
task.registerHelper('foo', function(a, b) {
  return a + b;
});

task.helper('foo', 2, 3) // 5
```

For example, in the [min][min] task, the majority of the actual minification work is done in an [uglify][min] helper, so that other tasks can utilize that code if they need to.

## Directives
Directives are essentially string placeholders for helper functions, specified as values in the [configuration object](#config). It's not as crazy as it sounds.

A good example of directives would be the `<json:package.json>` and `<config:lint.files>` directives in grunt's own [grunt.js gruntfile][gruntfile]. Or the `<banner>` and `<file_strip_banner:lib/hooker.js>` directives in [javascript-hooker's gruntfile](https://github.com/cowboy/javascript-hooker/blob/master/grunt.js).

In brief, when a directive like `<foo>` is encountered, the `foo` helper is executed, and its return value is used. If `<foo:bar:baz>` is encountered, the `foo` helper is executed, with arguments `"bar"` and `"baz"` passed in, and its return value is used.

Some of the built-in directives:

* `<config:prop.subprop>` - expand to the prop.subprop config property. Great for DRYing up file lists.
* `<json:file.json>` - expand to the object parsed from file.json (a valid JSON file).
* `<banner>` - the string in config property `meta.banner`, parsed via [handlebars][misc].
* `<banner:prop.subprop>` - same as above, but using a custom config property.
* `<file_strip_banner:file.js>` - expand to the given file, with any leading /*...*/ banner stripped.

Can you guess what these directives do? They're from grunt's own [grunt.js gruntfile][gruntfile].

```javascript
config.init({
  pkg: '<json:package.json>',
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
  },
  watch: {
    files: '<config:lint.files>',
    tasks: 'default'
  }
});
```

## Global Variables
In an effort to make things easier, there are a lot of global variables.

* `underscore` - [Underscore.js](http://underscorejs.org/)
* `util` - miscellaneous utilities
* `task` - the entire task interface
* `file` - glob expansion, file reading, writing, directory traversing
* `fail` - more serious than error logging, `fail.warn` and `fail.fatal` will halt everything
* `config` - reading values from the grunt configuration
* `option` - reading values from the command-line options
* `log` - don't use `console.log`, use `log.writeln` instead! [More info on log](#logging).
* `verbose` - just like `log`, but only logs if `--verbose` was specified. [More info on verbose](#logging).

Unfortunately, I haven't documented everything yet. Fortunately, the source is open and browsable. Have fun!

<div id="logging"></div>
## Logging
I wanted grunt to look pretty. As such, there are a LOT of logging methods, and a few useful patterns:

Note, all of the methods that actually log something are chainable.

* `log.write(msg)` - log msg, with no trailing newline
* `log.writeln(msg)` - log msg, with trailing newline
* `log.error(msg)` - if msg is omitted, logs ERROR in red, otherwise logs: >> msg, with trailing newline
* `log.ok(msg)` - if msg is omitted, logs OK in green, otherwise logs: >> msg, with trailing newline
* `log.subhead(msg)` - logs msg in bold, with trailing newline
* `log.writeflags(obj, prefix)` - logs a list of obj properties (good for debugging flags)
* `log.wordlist(arr)` - returns a comma-separated list of array items
* `log.verbose` - contains all methods of `log` but only logs if `--verbose` was specified.
* `log.notverbose` - contains all methods of `log` but only logs if `--verbose` wasn't specified.
* `log.verbose.or` - reference to `log.notverbose`
* `log.notverbose.or` - reference to `log.verbose`

There are a few other methods, but you shouldn't use them in your tasks or helpers, so they've been omitted.

A common pattern is to only log when in `--verbose` mode OR if an error occurs, like so:

```javascript
task.registerHelper('something', function(arg) {
  var result;
  var msg = 'Doing something...';
  verbose.write(msg);
  try {
    result = doSomethingThatThrowsAnExceptionOnError(arg);
    // Success!
    verbose.ok();
    return result;
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg).error().error(e.message);
    fail.warn('Something went wrong.', 50);
  }
});
```

An explanation of the above code:

1. `verbose.write(msg);` logs the message (no newline), but only in `--verbose` mode.
2. `verbose.ok();` logs OK in green, with a newline.
3. `verbose.or.write(msg).error().error(e.message);` does a few things:
  1. `verbose.or.write(msg)` logs the message (no newline) if not in `--verbose` mode, and returns the `notverbose` object.
  2. `.error()` logs ERROR in red, with a newline, and returns the `notverbose` object.
  3. `.error(e.message);` logs the actual error message (and returns the `notverbose` object).
4. `fail.warn('Something went wrong.', 50);` logs a warning in bright yellow, existing grunt with exit code 50, unless `--force` was specified.

You can write crazy logging chains, omg!

<div id="exit_codes"></div>
## Exit Codes

* `1` - Generic error.
* `2` - Config file not found.
* `3` - Generic task failed.
* `10` - Uglify-JS error.
* `11` - Banner generation error.
* `20` - Init error.
* `61-69` - Nodeunit errors.

<div id="examples"></div>
## Examples
In this example, you don't want to run `grunt lint concat` every time you need to process your code, because "dist/output.js" will be linted before it's created!

You should really do `grunt lint:beforeconcat concat lint:afterconcat`.

```javascript
config.init({
  // When the "concat:dist/output.js" task is run, the specified "foo.js" and
  // "bar.js" files will be concatenated in-order and saved to the "output.js"
  // output file. Because the "concat" task is a Basic task, when it is run
  // without an argument, all sub-tasks will automatically be run.
  concat: {
    'dist/output.js': ['src/foo.js', 'src/bar.js']
  },
  lint: {
    // When the "lint:beforeconcat" task is run, the specified "foo.js" and
    // "bar.js" files will be linted with JSHint. The same follows for the
    // "lint:afterconcat" task. Because the "lint" task is a Basic task, when
    // it is run without an argument, all sub-tasks will automatically be run.
    beforeconcat: ['src/foo.js', 'src/bar.js'],
    afterconcat: ['dist/output.js']
  }
});
```

And to make your workflow easier, create an [Alias Task](#tasks_alias):

```javascript
task.registerTask('default', 'lint:beforeconcat concat lint:afterconcat');
```

_(more examples coming... soon)_

## Contributing
Fork, tweak, and make pull requests.. but you'd better successfully `grunt` it first, or I'm not even looking.

## Release History

2012/01/11 - v0.1.0 - Initial release.

## License
Copyright (c) 2012 "Cowboy" Ben Alman  
Licensed under the MIT license.  
<http://benalman.com/about/license/>
