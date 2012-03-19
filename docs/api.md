[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# The grunt API

Grunt exposes a lot of its functionality on the `grunt` object passed into a [config.js gruntfile](configuring.md) or [tasks file](tasks_creating.md).

In a [gruntfile](configuring.md):

```javascript
exports.config = function(grunt) {
  // Tons o' stuff is available on the grunt object.
};
```

In a [custom tasks file](tasks_creating.md):

```javascript
exports.tasks = function(grunt) {
  // Tons o' stuff is available on the grunt object.
};
```

## Config


### grunt.initConfig
Initialize a configuration object for the current project. The specified `configObject` is used by tasks and helpers and can also be accessed using the [grunt.config](api_config.md) method. Nearly every project's [config.js gruntfile](configuring.md) will need this.

```javascript
grunt.initConfig(configObject);
```

See the [configuring grunt](configuring.md) documentation for more information and examples.

_This method is an alias for the [config.init](api_config.md) method._


## Creating Tasks


### grunt.registerTask
Register a task or an "alias task." This method supports the following two signatures:

If a string `taskList` is specified, the new task will be an alias for one or more other tasks. Whenever this "alias task" is run, every specified task in `taskList` will be run, in the order specified.

```javascript
grunt.registerTask(taskName, taskList);
```

If a `description` and `taskFunction` are passed, the specified function will be executed whenever the task is run. In addition, the specified description will be shown when `grunt --help` is run. Task-specific properties and methods are available inside the task function as properties of the `this` object.

Note that the `grunt.registerMultiTask` method, explained below, can be used to define a special type of task known as a "multi task."

```javascript
grunt.registerTask(taskName, description, taskFunction);
```

See the [creating tasks](tasks_creating.md) documentation for examples of tasks and alias tasks.

_This method is an alias for the [task.registerTask](api_task.md) method._


### grunt.registerMultiTask
Register a "multi task." A multi task is a task that implicitly iterates over all of its named sub-properties (AKA targets) if none was specified. In addition to the default properties and methods, extra multi task-specific properties are available inside the task function as properties of the `this` object.

Many of the built-in tasks, including the [lint](task_lint.md), [concat](task_concat.md) and [min](task_min.md) are multi tasks.

```javascript
grunt.registerMultiTask(taskName, description, taskFunction);
```

See the [creating tasks](tasks_creating.md) documentation for examples of multi tasks.

_This method is an alias for the [task.registerMultiTask](api_task.md) method._


### grunt.registerInitTask
This method is an alias for the [task.registerInitTask](api_task.md) method.

Usage:

```javascript
grunt.registerInitTask(taskName, description, taskFunction);
```

## Loading Externally-Defined Tasks

### grunt.loadTasks
This method is an alias for the [task.loadTasks](api_task.md) method.

Usage:

```javascript
grunt.loadTasks();
```

### grunt.loadNpmTasks
This method is an alias for the [task.loadNpmTasks](api_task.md) method.

Usage:

```javascript
grunt.loadNpmTasks();
```

## Defining and Executing Helpers

### grunt.registerHelper
This method is an alias for the [task.registerHelper](api_task.md) method.

Usage:

```javascript
grunt.registerHelper(helperName, helperFunction);
```

### grunt.helper
This method is an alias for the [task.helper](api_task.md) method.

Usage:

```javascript
grunt.helper(helperName [, arguments...]);
```

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
