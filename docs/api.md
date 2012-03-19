[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# The grunt API

Grunt exposes all of its methods and properties on the `grunt` object that gets passed into the `exports.config` function exported in your [grunt.js gruntfile](configuring.md) or the `exports.tasks` function exported in your [tasks file](tasks_creating.md).

For example, your project's [grunt.js gruntfile](configuring.md) might look like this:

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
Initialize a configuration object for the current project. The specified `configObject` is used by tasks and helpers and can also be accessed using the [grunt.config](api_config.md) method. Nearly every project's [grunt.js gruntfile](configuring.md) will call this method.

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

This example task logs `foo, testing 123` if grunt is run via `grunt foo:testing:123`. If the task is run without arguments as `grunt foo` the task logs `foo, no args`.

```javascript
grunt.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
  if (arguments.length === 0) {
    grunt.log.writeln(this.name + ", no args");
  } else {
    grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
  }
});
```

See the [creating tasks](tasks_creating.md) documentation for more examples of tasks and alias tasks.

_This method is an alias for the [task.registerTask](api_task.md) method._


### grunt.registerMultiTask
Register a "multi task." A multi task is a task that implicitly iterates over all of its named sub-properties (AKA targets) if no target was specified. In addition to the default properties and methods, extra multi task-specific properties are available inside the task function as properties of the `this` object.

Many of the built-in tasks, including the [lint task](task_lint.md), [concat task](task_concat.md) and [min task](task_min.md) are multi tasks.

```javascript
grunt.registerMultiTask(taskName, description, taskFunction)
```

Given the specified configuration, this example multi task would log `foo: 1,2,3` if grunt was run via `grunt log:foo`, or it would log `bar: hello world` if grunt was run via `grunt log:bar`. If grunt was run as `grunt log` however, it would log `foo: 1,2,3` then `bar: hello world` then `grunt baz: false`.

```javascript
grunt.initConfig({
  log: {
    foo: [1, 2, 3],
    bar: 'hello world',
    baz: false
  }
});

grunt.registerMultiTask('log', 'Log stuff.', function(target) {
  grunt.log.writeln(target + ': ' + this.data);
});
```

See the [creating tasks](tasks_creating.md) documentation for more examples of multi tasks.

_This method is an alias for the [task.registerMultiTask](api_task.md) method._


### grunt.registerInitTask
Register an "init task." An init task is a task that doesn't require any configuration data, and as such will still run even if grunt can't find a [grunt.js gruntfile](configuring.md). The [init task](task_init.md) is an example of an init task.

```javascript
grunt.registerInitTask(taskName, description, taskFunction)
```

For an init task example, see the [init task source](../tasks/init.js).

_This method is an alias for the [task.registerInitTask](api_task.md) method._


## Inside Tasks

### this.async
If a task is asynchronous, this method must be invoked to instruct grunt to wait. It returns a handle to a "done" function that should be called when the task has completed. `false` can be passed to the done function to indicate that the task has failed. If this method isn't invoked, the task executes synchronously.

```javascript
// Tell grunt this task is asynchronous.
var done = this.async();
// Your async code.
setTimeout(function() {
  // Let's simulate an error, sometimes.
  var success = Math.random() > 0.5;
  // All done!
  done(success);
}, 1000);
```

### this.name
The name of the task, as defined in `grunt.registerTask`. For example, if a "sample" task was run as `grunt sample` or `grunt sample:foo`, inside the task function, `this.name` would be `"sample"`.

### this.nameArgs
The name of the task, as specified with any colon-separated arguments or flags on the command-line. For example, if a "sample" task was run as `grunt sample:foo`, inside the task function, `this.nameArgs` would be `"sample:foo"`.

### this.args
An array of arguments passed to the task. For example, if a "sample" task was run as `grunt sample:foo:bar`, inside the task function, `this.args` would be `["foo", "bar"]`. Note that in multi tasks, the target is removed from the `this.args` array and is not passed into the task function.

### this.flags
An object generated from the arguments passed to the task. For example, if a "sample" task was run as `grunt sample:foo:bar`, inside the task function, `this.flags` would be `{foo: true, bar: true}`. In a multi task, the target name is not set as a flag.

### this.extraspaths
TODO: re-evaluate


## Inside Multi Tasks

### this.target
In a multi task, this is the name of the target currently being iterated over. For example, if a "sample" multi task was run as `grunt sample:foo` with the config data `{sample: {foo: "bar"}}`, inside the task function, `this.target` would be `"foo"`.

### this.data
In a multi task, this is the actual data stored in the grunt config object for the given target. For example, if a "sample" multi task was run as `grunt sample:foo` with the config data `{sample: {foo: "bar"}}`, inside the task function, `this.data` would be `"bar"`.

### this.file
In a multi task, target data can be stored in two different formats. A relatively basic "compact" format and a much more flexible "full" format. When the compact format is used, that key and value are made available as `this.file.dest` and `this.file.src`, respectively. When the full format is used, the specified `src` and `dest` values are used for `this.file.dest` and `this.file.src`.

Note that while grunt supports expanding [templates](api_template.md) for both `src` and `dest`, they only work for the `dest` file path when the _full_ format is used.

```javascript
grunt.initConfig({
  concat: {
    // This is the "compact" format.
    'dist/built.js': ['src/file1.js', 'src/file2.js'],
    // This is the "full" format.
    built: {
      src: ['src/file1.js', 'src/file2.js'],
      dest: 'dist/built.js'
    }
  }
});
```


## Loading Externally-Defined Tasks


### grunt.loadTasks
Load task-related files from the specified directory, relative to the [grunt.js gruntfile](configuring.md). This method can be used to load task-related files from a local grunt plugin by specifying the path to that plugin's "tasks" subdirectory.

```javascript
grunt.loadTasks(tasksPath)
```

_This method is an alias for the [task.loadTasks](api_task.md) method._


### grunt.loadNpmTasks
Load tasks and helpers from the specified Npm-installed grunt plugin. If the verion of grunt being run was installed globally via Npm, this will load a global Npm module. If the verion of grunt being run was installed locally via Npm, this will load a local Npm module.

```javascript
grunt.loadNpmTasks(pluginName)
```

_This method is an alias for the [task.loadNpmTasks](api_task.md) method._


## Defining and Executing Helpers

### grunt.registerHelper
Register a helper function that can be used by any task.

```javascript
grunt.registerHelper(helperName, helperFunction)
```

In this example helper, the numbers `1` and `2` are passed in and the value `3` is returned.

```javascript
grunt.registerHelper("add_two_nums", function(a, b) {
  return a + b;
});
```

_This method is an alias for the [task.registerHelper](api_task.md) method._


### grunt.helper
Invoke a registered helper function.

```javascript
grunt.helper(helperName [, arguments...])
```

In this example, the previously defined `add_two_nums` helper is invoked.

```javascript
grunt.helper("add_two_nums", 1, 2) // 3
```

_This method is an alias for the [task.helper](api_task.md) method._


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
