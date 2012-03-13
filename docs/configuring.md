[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# Configuring grunt

**If you're starting from scratch, try the [init task](task_init.md), which will set up a new grunt-based project for you. Even if you don't ultimately use the files that are generated, you can very quickly learn how grunt works.**

## The config file, aka "gruntfile"
Each time grunt is run, it looks in the current directory for a file named `grunt.js`. If this file is not found, grunt continues looking in parent directories until that file is found. This file is typically placed in the root of your project repository, and is a valid JavaScript file comprised of these parts:

* Project configuration
* Loading grunt plugins or tasks folders
* [Tasks](tasks_creating.md) and [helpers](helpers_directives.md)

This is an example of a very basic sample gruntfile that does all three of these things:

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'lib/**/*.js''test/**/*.js']
    },
    jshint: {
      options: {
        browser: true
      }
    }
  });

  // Load tasks from sample grunt plugin.
  grunt.loadNpmTasks('grunt-sample');

  // Default task.
  grunt.registerTask('default', 'lint sample');

};
```

## Project configuration

Each grunt task relies on configuration information defined in an object passed to `grunt.initConfig()`.

For example, this very simple configuration defines a list of files to be linted when the [lint task](task_lint.md) is run on the command line via `grunt lint`.

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['lib/*.js', 'test/*.js', 'grunt.js']
    }
  });

};
```

_Note: the [lint task](task_lint.md) is an example of a [multi task](tasks_builtin.md). You can run all targets of any multi task by just specifying the name of the task. In this case, running `grunt lint` would automatically run the `all` target and any others that might exist under `lint` instead of having to run `grunt lint:all` explicitly._

In another example, this very simple configuration saved in the root of a [jQuery repository](https://github.com/jquery/jquery) clone allows the jQuery QUnit unit tests to be run via grunt with `grunt qunit`.

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    qunit: {
      index: ['test/index.html']
    }
  });

};
```

_Note: even though jQuery's unit tests run in grunt doesn't mean they're going to actually pass. QUnit is running headless, after all._

You can store any arbitrary information inside of the configuration object, and as long as it doesn't conflict with a property one of your tasks is using, it will be ignored. Also, because this is JavaScript and not JSON, you can use any valid JavaScript here. This allows you to programatically generate the configuration object, if necessary.

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Project metadata, used by some directives, helpers and tasks.
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
    watch: {},
    // Global configuration options for JSHint.
    jshint: {},
    // Global configuration options for UglifyJS.
    uglify: {}
  });

};
```

_Note: you don't need to specify configuration settings for tasks that you don't use._

## Loading grunt plugins or tasks folders

While you can define [tasks](tasks_builtin.md) and [helpers](helpers_directives.md) in your project's gruntfile, you can also load tasks from external sources.

```javascript
exports.config = function(grunt) {

  // Load tasks and helpers from the "tasks" directory, relative to grunt.js.
  grunt.loadTasks('tasks');

  // Load tasks and helpers from the "grunt-sample" grunt plugin. Grunt plugins
  // are Npm modules, so note that if grunt is installed globally, this will use
  // the global "grunt-sample" Npm module. If grunt is installed locally, this
  // will use the local "grunt-sample" Npm module.
  grunt.loadNpmTasks('grunt-sample');

};
```

_Note: loading externally defined tasks and helpers in this way is preferred to loading them via the analogous `--tasks` command-line option. This is because when tasks are specified in the gruntfile or loaded via one of these commands in the gruntfile, the tasks effectively become part of the project and will always be used (provided they are available) whenever `grunt` is run._

## Tasks and helpers

You aren't required to define any tasks in your project gruntfile, because grunt provides a number of built-in tasks. That being said, until you define a `default` task, grunt won't know what to do when you run it just as `grunt` without specifying any tasks, because grunt doesn't provide a default `default` task.

The easiest way to define the default task is to create an [alias task](tasks_creating.md).

In the following example, a default task is defined that, when invoked by specifying `grunt` or `grunt default` on the command line, will execute the `lint`, `qunit`, `concat` and `min` tasks in-order. It behaves exactly as if `grunt lint qunit concat min` was run on the command line.

```javascript
exports.config = function(grunt) {

  // Default task.
  task.registerTask('default', 'lint qunit concat min');

};
```

_Note: choose the default tasks that make the most sense for your project. If you find yourself commonly executing other groups of tasks, create as many named aliases as you need!_

Take a look at the [example gruntfiles](example_gruntfiles.md) for more configuration examples.
