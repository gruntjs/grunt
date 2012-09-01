[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# watch (built-in task)

Watches files for changes and runs task(s) when they do so.

## About

This task monitors the file system and looks for changes to both existing and newly-created files that match a given pattern. When a file is added, changed or deleted, grunt runs the specified tasks.

This is useful for commonly-repeated actions like automatically linting JavaScript files or running unit tests when files are changed.

_Need some help getting started with grunt? Visit the [getting started](getting_started.md) page. And if you're creating your own tasks, be sure to check out the [types of tasks](types_of_tasks.md) page as well as the [API documentation](api.md)._

## A Very Important Note
Your Gruntfile **must** contain this code, once and **only** once. If it doesn't, grunt won't work. For the sake of brevity, this "wrapper" code has been omitted from all examples on this page, but it needs to be there.

```javascript
module.exports = function(grunt) {
  // Your grunt code goes in here.
};
```

## Project configuration

This example shows a brief overview of the [config](api_config.md) properties used by the `watch` task. For a more in-depth explanation, see the usage examples.

```javascript
// Project configuration.
grunt.initConfig({
  // Configuration options.
  watch: {}
});
```

## Usage examples

### Basic Use

In this example, `grunt watch` will start a process that monitors `Gruntfile.js`, all `.js` files in `./lib` and `./test`, and all `.html` files in `./test`. If any of these files are changed or new files matching the specified patterns are added, both the `lint` and `qunit` tasks will be run in order.

```javascript
// Project configuration.
grunt.initConfig({
  lint: {
    files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
  },
  qunit: {
    all: ['test/**/*.html']
  },
  watch: {
    files: ['<%= lint.files %>', '<%= lint.qunit %>']
    tasks: ['lint', 'qunit']
  }
});
```

### Multiple Watch Targets

Often you may want to be able to watch different sets of files, running different tasks depending on which files have changed. For example, given the previous configuration, the `lint` task will run every time we change an HTML file, even though no JavaScript files have been changed.

In the following example, because separate `lint` and `qunit` watch targets have been defined, `grunt watch` will start a process that monitors all files but only runs the appropriate tasks when files change.

_Note that a specific subset of files can be watched by running `grunt watch:lint` or `grunt watch:qunit`._

```javascript
// Project configuration.
grunt.initConfig({
  lint: {
    files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
  },
  qunit: {
    all: ['test/**/*.html']
  },
  watch: {
    lint: {
      files: '<%= lint.files %>',
      tasks: ['lint']
    },
    qunit: {
      files: ['lib/**/*.js', 'test/**/*.js', 'test/**/*.html']
      tasks: ['qunit']
    }
  }
});
```

## Notes

* At present, there is no mechanism to pass the changed files into the tasks to be run, i.e. if a single file changes, in the example above, all the files would be linted, and all the tests would be run.
