[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# The grunt API

Grunt exposes all of its methods and properties on the `grunt` object that gets passed into the `exports.config` function exported in your [config.js gruntfile](configuring.md) or the `exports.tasks` function exported in your [tasks file](tasks_creating.md).

For example, your project's [config.js gruntfile](configuring.md) might look like this:

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

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  grunt.loadNpmTasks('grunt-sample');

  // Default task.
  grunt.registerTask('default', 'lint sample');

};
```

And if you're creating a [grunt plugin](plugins.md) or just organizing tasks into a folder, a [custom tasks file](tasks_creating.md) might look like this:

```javascript
exports.tasks = function(grunt) {

  // Create a new task.
  grunt.registerTask('awesome', 'Print out "awesome!!!"', function() {
    var awesome = grunt.helper('awesome');
    log.write(awesome);
  });

  // Register a helper.
  grunt.registerHelper('awesome', function() {
    return 'awesome!!!';
  });

};
```

But these are just examples. For more information, take a look at the API documentation:

## Config


### grunt.initConfig
Initialize a configuration object for the current project. The specified `configObject` is used by tasks and helpers and can also be accessed using the [grunt.config](api_config.md) method. Nearly every project's [config.js gruntfile](configuring.md) will call this method.

```javascript
grunt.initConfig(configObject)
```

This example contains sample config data for the [lint task](task_lint.md):

```javascript
grunt.initConfig({
  lint: {
    all: ['lib/*.js', 'test/*.js', 'grunt.js']
  }
});
```

See the [configuring grunt](configuring.md) page for more configuration examples.

_This method is an alias for the [config.init](api_config.md) method._


## Creating Tasks


### grunt.registerTask
Register an "alias task" or a task function. This method supports the following two signatures:

**Alias task**

If a string `taskList` is specified, the new task will be an alias for one or more other tasks. Whenever this "alias task" is run, every specified task in `taskList` will be run, in the order specified.

```javascript
grunt.registerTask(taskName, taskList)
```

This example alias task defines a "default" task whereby the "lint", "qunit", "concat" and "min" tasks are run automatically if grunt is executed without any tasks specified:

```javascript
task.registerTask('default', 'lint qunit concat min');
```

**Function task**

If a `description` and `taskFunction` are passed, the specified function will be executed whenever the task is run. In addition, the specified description will be shown when `grunt --help` is run. Task-specific properties and methods are available inside the task function as properties of the `this` object.

Note that the `grunt.registerMultiTask` method, explained below, can be used to define a special type of task known as a "multi task."

```javascript
grunt.registerTask(taskName, description, taskFunction)
```

This example task logs "foo, testing 123" if grunt is run via `grunt foo:testing:123`. If the task was run without arguments, as `grunt foo` it logs "foo, no args".

```javascript
grunt.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
  if (arguments.length === 0) {
    grunt.log.writeln(this.name + ", no args");
  } else {
    grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
  }
});
```

See the [creating tasks](tasks_creating.md) documentation for examples of tasks and alias tasks.

_This method is an alias for the [task.registerTask](api_task.md) method._


### grunt.registerMultiTask
Register a "multi task." A multi task is a task that implicitly iterates over all of its named sub-properties (AKA targets) if none was specified. In addition to the default properties and methods, extra multi task-specific properties are available inside the task function as properties of the `this` object.

Many of the built-in tasks, including the [lint task](task_lint.md), [concat task](task_concat.md) and [min task](task_min.md) are multi tasks.

```javascript
grunt.registerMultiTask(taskName, description, taskFunction)
```

See the [creating tasks](tasks_creating.md) documentation for examples of multi tasks.

_This method is an alias for the [task.registerMultiTask](api_task.md) method._


### grunt.registerInitTask
This method is an alias for the [task.registerInitTask](api_task.md) method.

Usage:

```javascript
grunt.registerInitTask(taskName, description, taskFunction)
```

## Loading Externally-Defined Tasks

### grunt.loadTasks
This method is an alias for the [task.loadTasks](api_task.md) method.

Usage:

```javascript
grunt.loadTasks()
```

### grunt.loadNpmTasks
This method is an alias for the [task.loadNpmTasks](api_task.md) method.

Usage:

```javascript
grunt.loadNpmTasks()
```

## Defining and Executing Helpers

### grunt.registerHelper
This method is an alias for the [task.registerHelper](api_task.md) method.

Usage:

```javascript
grunt.registerHelper(helperName, helperFunction)
```

### grunt.helper
This method is an alias for the [task.helper](api_task.md) method.

Usage:

```javascript
grunt.helper(helperName [, arguments...])
```

## Inside Tasks

### this.foo
EXPLAIN



## Internals

* [grunt.utils](api_utils.md) - miscellaneous utilities
* [grunt.template](api_template.md) - template methods
* [grunt.task](api_task.md) - the entire task interface
* [grunt.file](api_file.md) - glob expansion, file reading, writing, directory traversing
* [grunt.fail](api_fail.md) - more serious than error logging, `fail.warn` and `fail.fatal` will halt everything
* [grunt.config](api_config.md) - reading values from the grunt configuration
* [grunt.option](api_option.md) - reading values from the command-line options
* [grunt.log](api_log.md) - don't use `console.log`, use `log.writeln` instead!
* [grunt.verbose](api_verbose.md) - just like `log`, but only logs if `--verbose` was specified.

## External libraries, exposed

* [utils.async](api_utils.md) - [Async utilities](https://github.com/caolan/async)
* [utils._](api_utils.md) - [Underscore.js](http://underscorejs.org/), including [Underscore.string](https://github.com/epeli/underscore.string)
* [utils.hooker](api_utils.md) - [JavaScript hooker](https://github.com/cowboy/javascript-hooker)

Unfortunately, I haven't documented everything yet. Fortunately, the source is open and browsable. Have fun!
