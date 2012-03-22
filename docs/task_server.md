[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# server (built-in task)
Start a static web server.

## About

This task starts a static web server on a specified port, at a specified path, which runs as long as grunt is running. Once grunt's tasks have completed, the web server stops.

_Need some help getting started with grunt? See the [configuring grunt](getting_started.md) page._

## Project configuration

This example [gruntfile](getting_started.md) shows a brief overview of the [config](api_config.md) properties used by the `server` task. For a more in-depth explanation, see the usage examples.

```javascript
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configuration options.
    server: {}
  });

};
```

## Usage examples

In this example, `grunt server` will start a static web server at `http://localhost:8000/`, with its base path set to the gruntfile's directory. Of course, it will then immediately stop serving files, because grunt exits automatically when there are no more tasks to run.

The `server` task is most useful when used in conjunction with another task, like the [qunit](task_qunit.md) task.

```javascript
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    server: {
      port: 8000,
      base: '.'
    }
  });

};
```

See the [server task source](../tasks/server.js) for more information.
