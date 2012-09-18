[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# nodeunit (built-in task)
Run unit tests with [Nodeunit][nodeunit].

[nodeunit]: https://github.com/caolan/nodeunit/

## About

This task is a [multi task](types_of_tasks.md), meaning that grunt will automatically iterate over all `nodeunit` targets if a target is not specified.

This task is for testing on the server side. If you're looking to test JavaScript that uses `window` or the DOM, please use the [qunit task](task_qunit.md).

### Nodeunit

[Nodeunit][nodeunit] is a powerful and simple asynchronous unit testing framework for node.js.

## A Very Important Note

Your Gruntfile **must** contain this code, once and **only** once. If it doesn't, grunt won't work. For the sake of brevity, this "wrapper" code has been omitted from all examples on this page, but it needs to be there.

```javascript
module.exports = function(grunt) {
  // Your grunt code goes in here.
};
```

## Project configuration

This example shows a brief overview of the [config](api_config.md) properties used by the `nodeunit` task. For a more in-depth explanation, see the usage examples.

```javascript
// Project configuration.
grunt.initConfig({
  // Lists of files to be unit tested with Nodeunit.
  nodeunit: {}
});
```

## Usage examples

### Wildcards

In this example, `grunt nodeunit` will test all `.js` files in the test directory. The wildcard is expanded to match each individual file and each ran by [Nodeunit][nodeunit].

```javascript
// Project configuration.
grunt.initConfig({
  nodeunit: {
    all: ['test/*.js']
  }
});
```

With a slight modification, `grunt nodeunit` will test all `.js` files in the test directory _and all subdirectories_. See the [minimatch](https://github.com/isaacs/minimatch) module's documentation for more details on wildcard patterns.

```javascript
// Project configuration.
grunt.initConfig({
  nodeunit: {
    all: ['test/**/*.js']
  }
});
```
