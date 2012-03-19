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
Initialize a configuration object for the current project. The passed-in `configObject` is used by tasks and helpers and can also be accessed using the [grunt.config](api_config.md) method. Nearly every project's [config.js gruntfile](configuring.md) will need this.

Usage:

```javascript
grunt.initConfig(configObject);
```

See the [configuring grunt](configuring.md) documentation for more information and examples.

_This method is a convenient shortcut for the [config.init](api_config.md) method._


## Tasks: Creating

### grunt.registerTask
This method is a convenient shortcut for the [task.registerTask](api_task.md) method.

Usage:

```javascript
grunt.registerTask(taskName, taskList);
grunt.registerTask(taskName, description, taskFunction);
```

### grunt.registerMultiTask
This method is a convenient shortcut for the [task.registerMultiTask](api_task.md) method.

Usage:

```javascript
grunt.registerMultiTask(taskName, description, taskFunction);
```

### grunt.registerInitTask
This method is a convenient shortcut for the [task.registerInitTask](api_task.md) method.

Usage:

```javascript
grunt.registerInitTask(taskName, description, taskFunction);
```

## Tasks: Loading

### grunt.loadTasks
This method is a convenient shortcut for the [task.loadTasks](api_task.md) method.

Usage:

```javascript
grunt.loadTasks();
```

### grunt.loadNpmTasks
This method is a convenient shortcut for the [task.loadNpmTasks](api_task.md) method.

Usage:

```javascript
grunt.loadNpmTasks();
```

## Helpers

### grunt.registerHelper
This method is a convenient shortcut for the [task.registerHelper](api_task.md) method.

Usage:

```javascript
grunt.registerHelper(helperName, helperFunction);
```

### grunt.helper
This method is a convenient shortcut for the [task.helper](api_task.md) method.

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
