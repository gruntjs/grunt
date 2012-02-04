[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# Configuring grunt

## The config file, aka "gruntfile"
Each time grunt is run, it looks in the current directory for a file named `grunt.js`, and if not found, continues looking in parent directories until that file is found. This file is typically placed in the root of your project repository, and is a valid JavaScript file comprised of two parts:

1. Project configuration
2. [Tasks](tasks.md) and [helpers](helpers_directives.md)

## Project configuration

Each grunt task relies on configuration information defined in a single `config.init()` call in the gruntfile. Usually, this information is specified in task-named sub-properties of a main configuration object. It's not as complicated as it sounds.

For example, this very simple configuration defines a list of files to be linted when the "lint:all" sub-task is run on the command line like this: `grunt lint:all` (or less specifically, `grunt lint`).

```javascript
/*global config:true, task:true*/
config.init({
  lint: {
    all: ['lib/*.js', 'test/*.js', 'grunt.js']
  }
});
```

_Note: you can run all sub-tasks of any [basic task](tasks.md) by just specifying the name of the task, like `grunt lint`._

In another example, this very simple configuration saved in the root of a [jQuery repository](https://github.com/jquery/jquery) clone allows the jQuery QUnit unit tests to be run via grunt with `grunt qunit:index` (or less specifically, `grunt qunit`).

```javascript
/*global config:true, task:true*/
config.init({
  qunit: {
    index: ['test/index.html']
  }
});
```

_Note: even though jQuery's unit tests run in grunt doesn't mean they're going to actually pass. It is headless, after all._

You can store any arbitrary information inside of the configuration object, and as long as it doesn't conflict with a property one of your tasks is using, it will be ignored.

```javascript
/*global config:true, task:true*/
config.init({
  // Generic project information used by some helpers and tasks.
  meta: {},
  // Lists of files to be concatenated, used by the "concat" task.
  concat: {},
  // Lists of files to be linted with JSHint, used by the "lint" task.
  lint: {},
  // Lists of files to be minififed with UglifyJS, used by the "min" task.
  min: {},
  // Lists of files or URLs to be unit tested with QUnit, used by the "qunit" task.
  qunit: {},
  // Configuration options for the "server" task.
  server: {},
  // Lists of files to be unit tested with Nodeunit, used by the "test" task.
  test: {},
  // Configuration options for the "watch" task.
  server: {},
  // Global configuration options for JSHint.
  jshint: {},
  // Global configuration options for UglifyJS.
  uglify: {}
});
```

_Note: you don't need to specify configuration settings for tasks that you don't use._

## Project tasks

You aren't required to define any tasks in your project gruntfile, because grunt ships with a number of built-in tasks. That being said, until you define a `default` task, grunt won't know what to do when you run it just as `grunt` (without specifying any tasks).

The easiest way to define the default task is to create an [alias task](tasks.md).

In the following example, a default task is defined that, when invoked by `grunt` or `grunt default`, will execute the `lint`, `qunit`, `concat` and `min` tasks in-order. It behaves exactly as if `grunt lint qunit concat min` was run on the command line.

```javascript
// Default task.
task.registerTask('default', 'lint qunit concat min');
```

_Note: choose the default tasks that make the most sense for your project. If you find yourself commonly executing other "groups" of tasks, create as many other named aliases as you need!_

Take a look at the [example gruntfiles](example_gruntfiles.md) for more configuration examples.
