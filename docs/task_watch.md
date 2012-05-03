[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# watch (built-in task)
Watches files for changes, and runs task(s) when they do so.

## About <a name="about" href="#about" title="Link to this section">⚑</a>

This task monitors the file system and looks for changes to existing files that match a given pattern. When a file is changed, grunt runs a list of tasks. It will also match new files that are created which match the pattern.

This is be useful for actions like automatically linting JavaScript files, or running a test suite, when files are changed.


_Need some help getting started with grunt? Visit the [getting started](getting_started.md) page. And if you're creating your own tasks or helpers, be sure to check out the [types of tasks](types_of_tasks.md) page as well as the [API documentation](api.md)._

## A Very Important Note <a name="a-very-important-note" href="#a-very-important-note" title="Link to this section">⚑</a>
Your `grunt.js` gruntfile **must** contain this code, once and **only** once. If it doesn't, grunt won't work. For the sake of brevity, this "wrapper" code has been omitted from all examples on this page, but it needs to be there.

```javascript
module.exports = function(grunt) {
  // Your grunt code goes in here.
};
```

## Project configuration <a name="project-configuration" href="#project-configuration" title="Link to this section">⚑</a>

This example shows a brief overview of the [config](api_config.md) properties used by the `watch` task. For a more in-depth explanation, see the usage examples.

```javascript
// Project configuration.
grunt.initConfig({
  // Configuration options.
  watch: {}
});
```

## Usage examples <a name="usage-examples" href="#usage-examples" title="Link to this section">⚑</a>

### Basic Use <a name="basic-use" href="#basic-use" title="Link to this section">⚑</a>

In this example, `grunt watch` will start a process that monitors `grunt.js`; all `.js` files in `./lib` and `./test`, and all `.html` files in `./test`. If any of these files are changed, or added, the `lint` and `qunit` tasks will be run.

```javascript
// Project configuration.
grunt.initConfig({
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
  },
  qunit: {
    all: ['test/**/*.html']
  },
  watch: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js', 'test/**/*.html']
    tasks: 'lint qunit'
  }
});
```

### Multiple Watch Commands <a name="multiple-watch-commands" href="#multiple-watch-commands" title="Link to this section">⚑</a>

Often you may want multiple different watch commands running at the same time. As a simple example, in the watch setup above, the linter is going to run everytime we change a `test/**/*.html` file, even though no JavaScript files have been changed. We can split the lint, and qunit setup like so:

```javascript
// Project configuration.
grunt.initConfig({
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
  },
  qunit: {
    all: ['test/**/*.html']
  },
  watch: {
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
      tasks: 'lint'
    },
    qunit: {
      files: ['lib/**/*.js', 'test/**/*.js', 'test/**/*.html']
      tasks: 'qunit'
    }
  }
});
```

Now, if we run `grunt watch` both watchers will run on the appropriate changes. Alternatively we can only run one of the watchers by running `grunt watch:lint` or `grunt watch:qunit`.


## Notes

* At present, there is no mechanism to pass the changed files into the tasks to be run, i.e. if a single file changes, in the example above, all the files would be linted, and all the tests would be run.
