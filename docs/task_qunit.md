[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# qunit (built-in task)
Run [QUnit][qunit] unit tests in a headless [PhantomJS][phantom] instance.

[qunit]: http://docs.jquery.com/QUnit
[phantom]: http://www.phantomjs.org/

## About

This task is a [multi task](tasks_creating.md), meaning that grunt will automatically iterate over all `qunit` targets if no specific target is specified.

_Need some help getting started with grunt? See the [configuring grunt](configuring.md) page._

## Usage examples

### Wildcards

In this example, `grunt qunit` will test all `.html` files in the test directory. First, the wildcard is expanded to match each individual file. Then, each matched filename is converted to the appropriate `file://` URI. Finally, [QUnit][qunit] is run for each URI.

```javascript
/*global config:true, task:true*/
config.init({
  qunit: {
    all: ['test/*.html']
  }
});
```

With a slight modification, `grunt qunit` will test all `.html` files in the test directory _and all subdirectories_. See the [minimatch](https://github.com/isaacs/minimatch) module's documentation for more details on wildcard patterns.

```javascript
/*global config:true, task:true*/
config.init({
  qunit: {
    all: ['test/**/*.html']
  }
});
```

### Testing via http:// or https://

In circumstances where running unit tests from `file://` URIs is inadequate, you can specify `http://` or `https://` URIs instead. If `http://` or `https://` URIs have been specified, those URIs will be passed directly into [QUnit][qunit] as-specified.

In this example, `grunt qunit` will test two files, served from the server running at `localhost:8000`.

```javascript
/*global config:true, task:true*/
config.init({
  qunit: {
    all: ['http://localhost:8000/test/foo.html', 'http://localhost:8000/test/bar.html']
  }
});
```

_Note: grunt does NOT start a server at `localhost:8000` automatically. While grunt DOES have a [server](task_server.md) task that can be run before the qunit task to serve files statically, it must be started manually..._

### Using the built-in static webserver

If a web server isn't running at `localhost:8000`, running `grunt qunit` with `http://localhost:8000/` URIs will fail because grunt won't be able to load those URIs. This can be easily rectified by starting the built-in static web server via the [server](task_server.md) task.

In this example, running `grunt server qunit` will first start a static web server on `localhost:8000`, with its base path set to the gruntfile's directory. Then, the `qunit` task will be run, requesting the specified URIs from that server.

```javascript
/*global config:true, task:true*/
config.init({
  qunit: {
    all: ['http://localhost:8000/test/foo.html', 'http://localhost:8000/test/bar.html']
  },
  server: {
    port: 8000,
    base: '.'
  }
}
});
```

To simplify your workflow, you can create an [alias task](tasks_creating.md) to run both the `server` and `qunit` tasks together.

```javascript
task.registerTask('test', 'server qunit');
```

## QUnit

[QUnit][qunit] is a powerful, easy-to-use, JavaScript test suite. It's used by the jQuery project to test its code and plugins but is capable of testing any generic JavaScript code.

## PhantomJS

[PhantomJS](http://www.phantomjs.org/) is a headless WebKit with JavaScript API. It has fast and native support for various web standards: DOM handling, CSS selector, JSON, Canvas, and SVG. PhantomJS is required for the `qunit` task to work.

### Installation

There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

### Updating the system PATH

The `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)

## Debugging

Running grunt with the `--debug` flag will output a lot of PhantomJS-specific debugging information. This can be very helpful in seeing what actual URIs are being requested and received by PhantomJS.

See the [qunit task source](https://github.com/cowboy/grunt/blob/master/tasks/qunit.js) for more information.
