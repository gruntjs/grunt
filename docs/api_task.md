[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.task

Underscore.js template processing and other template-related methods.

See the [task lib source](../lib/grunt/task.js) for more information.

task.registerTask
task.registerMultiTask
task.registerInitTask
task.renameTask

task.current

task.registerHelper
task.renameHelper
task.helper

task.loadTasks
task.loadNpmTasks


task.directive
task.getDirectiveParts

task.run
task.clearQueue
task.requires
task.runAllTargets

task.hadErrors



## The task API

Note that any method marked with a ☃ (unicode snowman) is available directly on the `grunt` object in addition to being available on the `grunt.task` object. Just so you know. See the [API main page](api.md) for more usage information.


## Creating Tasks


### grunt.task.registerTask ☃
Register an "alias task" or a task function. This method supports the following two signatures:

**Alias task**

If a string `taskList` is specified, the new task will be an alias for one or more other tasks. Whenever this "alias task" is run, every specified task in `taskList` will be run, in the order specified.

```javascript
grunt.task.registerTask(taskName, taskList)
```

This example alias task defines a "default" task whereby the "lint", "qunit", "concat" and "min" tasks are run automatically if grunt is executed without any tasks specified:

```javascript
task.registerTask('default', 'lint qunit concat min');
```

**Function task**

If a `description` and `taskFunction` are passed, the specified function will be executed whenever the task is run. In addition, the specified description will be shown when `grunt --help` is run. Task-specific properties and methods are available inside the task function as properties of the `this` object.

Note that the `grunt.task.registerMultiTask` method, explained below, can be used to define a special type of task known as a "multi task."

```javascript
grunt.task.registerTask(taskName, description, taskFunction)
```

This example task logs `foo, testing 123` if grunt is run via `grunt foo:testing:123`. If the task is run without arguments as `grunt foo` the task logs `foo, no args`.

```javascript
grunt.task.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
  if (arguments.length === 0) {
    grunt.log.writeln(this.name + ", no args");
  } else {
    grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
  }
});
```

See the [creating tasks](tasks_creating.md) documentation for more examples of tasks and alias tasks.

This method is also available as [grunt.registerTask](api.md)._


### grunt.task.registerMultiTask ☃
Register a "multi task." A multi task is a task that implicitly iterates over all of its named sub-properties (AKA targets) if no target was specified. In addition to the default properties and methods, extra multi task-specific properties are available inside the task function as properties of the `this` object.

Many of the built-in tasks, including the [lint task](task_lint.md), [concat task](task_concat.md) and [min task](task_min.md) are multi tasks.

```javascript
grunt.task.registerMultiTask(taskName, description, taskFunction)
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

grunt.task.registerMultiTask('log', 'Log stuff.', function(target) {
  grunt.log.writeln(target + ': ' + this.data);
});
```

See the [creating tasks](tasks_creating.md) documentation for more examples of multi tasks.

This method is also available as [grunt.registerMultiTask](api.md)._


### grunt.task.registerInitTask ☃
Register an "init task." An init task is a task that doesn't require any configuration data, and as such will still run even if grunt can't find a [grunt.js gruntfile](configuring.md). The [init task](task_init.md) is an example of an init task.

```javascript
grunt.task.registerInitTask(taskName, description, taskFunction)
```

For an init task example, see the [init task source](../tasks/init.js).

This method is also available as [grunt.registerInitTask](api.md)._

### grunt.task.renameTask ☃
Rename a task. This might be useful if you want to override the default behavior of a task, while retaining the old name.

```javascript
grunt.task.renameTask(oldname, newname)
```

This method is also available as [grunt.renameTask](api.md)._

## Inside Tasks

### this / grunt.task.current
An object is made available as `this` inside each task function that contains a number of useful task-specific properties and methods. It is also exposed as `grunt.task.current` for use in [templates](api_template.md).

### this.async / grunt.task.current.async
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

### this.name / grunt.task.current.name
The name of the task, as defined in `grunt.registerTask`. For example, if a "sample" task was run as `grunt sample` or `grunt sample:foo`, inside the task function, `this.name` would be `"sample"`.

### this.nameArgs / grunt.task.current.nameArgs
The name of the task, as specified with any colon-separated arguments or flags on the command-line. For example, if a "sample" task was run as `grunt sample:foo`, inside the task function, `this.nameArgs` would be `"sample:foo"`.

### this.args / grunt.task.current.args
An array of arguments passed to the task. For example, if a "sample" task was run as `grunt sample:foo:bar`, inside the task function, `this.args` would be `["foo", "bar"]`. Note that in multi tasks, the target is removed from the `this.args` array and is not passed into the task function.

### this.flags / grunt.task.current.flags
An object generated from the arguments passed to the task. For example, if a "sample" task was run as `grunt sample:foo:bar`, inside the task function, `this.flags` would be `{foo: true, bar: true}`. In a multi task, the target name is not set as a flag.

### this.extraspaths / grunt.task.current.extraspaths
TODO: re-evaluate


## Inside Multi Tasks

### this.target / grunt.task.current.target
In a multi task, this is the name of the target currently being iterated over. For example, if a "sample" multi task was run as `grunt sample:foo` with the config data `{sample: {foo: "bar"}}`, inside the task function, `this.target` would be `"foo"`.

### this.data / grunt.task.current.data
In a multi task, this is the actual data stored in the grunt config object for the given target. For example, if a "sample" multi task was run as `grunt sample:foo` with the config data `{sample: {foo: "bar"}}`, inside the task function, `this.data` would be `"bar"`.

### this.file / grunt.task.current.file
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


### grunt.task.loadTasks ☃
Load task-related files from the specified directory, relative to the [grunt.js gruntfile](configuring.md). This method can be used to load task-related files from a local grunt plugin by specifying the path to that plugin's "tasks" subdirectory.

```javascript
grunt.task.loadTasks(tasksPath)
```

This method is also available as [grunt.loadTasks](api.md)._


### grunt.task.loadNpmTasks ☃
Load tasks and helpers from the specified Npm-installed grunt plugin. If the verion of grunt being run was installed globally via Npm, this will load a global Npm module. If the verion of grunt being run was installed locally via Npm, this will load a local Npm module.

```javascript
grunt.task.loadNpmTasks(pluginName)
```

This method is also available as [grunt.loadNpmTasks](api.md)._


## Defining and Executing Helpers

### grunt.task.registerHelper ☃
Register a helper function that can be used by any task.

```javascript
grunt.task.registerHelper(helperName, helperFunction)
```

In this example helper, the numbers `1` and `2` are passed in and the value `3` is returned.

```javascript
grunt.task.registerHelper("add_two_nums", function(a, b) {
  return a + b;
});
```

This method is also available as [grunt.registerHelper](api.md)._

### grunt.task.renameHelper ☃
Rename a helper. This might be useful if you want to override the default behavior of a helper, while retaining the old name (to avoid having to completely recreate an already-made task just because you needed to override or extend a built-in helper).

```javascript
grunt.task.renameHelper(oldname, newname)
```

This method is also available as [grunt.renameHelper](api.md)._

### grunt.task.helper ☃
Invoke a registered helper function.

```javascript
grunt.task.helper(helperName [, arguments...])
```

In this example, the previously defined `add_two_nums` helper is invoked.

```javascript
grunt.task.helper("add_two_nums", 1, 2) // 3
```

This method is also available as [grunt.helper](api.md)._



### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.task.XXX
DESCRIPTION

```javascript
grunt.task.XXX()
```

In this example, DESCRIPTION

```javascript
```

