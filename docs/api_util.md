[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.util

Miscellaneous utilities, including Underscore.js, Async and Hooker.

_Note: `grunt.utils` was renamed to `grunt.util` and deprecated in grunt v0.4.0. Please ensure that your custom tasks are are up-to-date._

See the [util lib source](../lib/grunt/util.js) for more information.

## The util API

### grunt.util.kindOf
Return the "kind" of a value. Like `typeof` but returns the internal `[[Class]]` value. Possible results are `"number"`, `"string"`, `"boolean"`, `"function"`, `"regexp"`, `"array"`, `"date"`, `"error"`, `"null"`, `"undefined"` and the catch-all `"object"`.

```javascript
grunt.util.kindOf(value)
```

### grunt.util.error
Return a new Error instance (that can be thrown) with the appropriate message. If an Error object is specified instead of `message` that object will be returned. Also, if an Error object is specified for `origError` and grunt was run with the `--debug 9` option, the original Error stack will be dumped.

```javascript
grunt.util.error(message [, origError])
```

### grunt.util.linefeed
The linefeed character, normalized for the current operating system. (`\r\n` on Windows, `\n` otherwise)

### grunt.util.normalizelf
Given a string, return a new string with all the linefeeds normalized for the current operating system. (`\r\n` on Windows, `\n` otherwise)

```javascript
grunt.util.normalizelf(string)
```

### grunt.util.recurse
Recurse through nested objects and arrays, executing `callbackFunction` for each non-object value. If `continueFunction` returns `false`, a given object or value will be skipped.

```javascript
grunt.util.recurse(object, callbackFunction, continueFunction)
```

See the [config lib source](../lib/grunt/config.js) for usage examples.

### grunt.util.repeat
Return string `str` repeated `n` times.

```javascript
grunt.util.repeat(n, str)
```

### grunt.util.pluralize
Given `str` of `"a/b"`, If `n` is `1`, return `"a"` otherwise `"b"`. You can specify a custom separator if '/' doesn't work for you.

```javascript
grunt.util.pluralize(n, str, separator)
```

### grunt.util.spawn
Spawn a child process, keeping track of its stdout, stderr and exit code. The method returns a reference to the spawned child. When the child exits, the done function is called.

```javascript
grunt.util.spawn(options, doneFunction)
```

The `options` object has these possible properties:

```javascript
var options = {
  // The command to execute. It should be in the system path.
  cmd: commandToExecute,
  // An array of arguments to pass to the command.
  args: arrayOfArguments,
  // Additional options for the Node.js child_process spawn method.
  opts: nodeSpawnOptions,
  // If this value is set and an error occurs, it will be used as the value
  // and null will be passed as the error value.
  fallback: fallbackValue
};
```

The done function accepts these arguments:

```javascript
function doneFunction(error, result, code) {
  // If the exit code was non-zero and a fallback wasn't specified, the error
  // object is the same as the result object.
  error
  // The result object is an object with the properties .stdout, .stderr, and
  // .code (exit code).
  result
  // When result is coerced to a string, the value is stdout if the exit code
  // was zero, the fallback if the exit code was non-zero and a fallback was
  // specified, or stderr if the exit code was non-zero and a fallback was
  // not specified.
  String(result)
  // The numeric exit code.
  code
}
```

See the [init task source](../tasks/init.js) and the [qunit task source](../tasks/qunit.js) for usage examples.


### grunt.util.toArray
Given an array or array-like object, return an array. Great for converting `arguments` objects into arrays.

```javascript
grunt.util.toArray(arrayLikeObject)
```

### grunt.util.callbackify

Run a function that returns a value in a callback instead. Our example function that returns a value:

```javascript
function add(a, b) {
  return a + b;
}
```

Using callbackify we can run it using a callback:

```javascript
grunt.util.callbackify(add)(1, 2, function(result) {
  console.log('1 plus 2 equals ' + result);
});
```

This will also work on sync and async functions with existing callbacks.

## Internal libraries

### grunt.util.namespace
An internal library for resolving deeply-nested properties in objects.

### grunt.util.task
An internal library for task running.


## External libraries

### grunt.util._
[Underscore.js](http://underscorejs.org/) - Tons of super-useful array, function and object utility methods.
[Underscore.string](https://github.com/epeli/underscore.string) - Tons of string utility methods.

Note that Underscore.string is mixed into `grunt.util._` but is also available as `grunt.util._.str` for methods that conflict with existing Underscore.js methods.

### grunt.util.async
[Async](https://github.com/caolan/async) - Async utilities for node and the browser.

### grunt.util.hooker
[JavaScript Hooker](https://github.com/cowboy/javascript-hooker) - Monkey-patch (hook) functions for debugging and stuff.
