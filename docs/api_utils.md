[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.utils

Miscellaneous utilities, including Underscore.js, Async and Hooker.

See the [utils lib source](../lib/grunt/utils.js) for more information.

## The utils API <a name="the-utils-api" href="#the-utils-api" title="Link to this section">⚑</a>

### grunt.utils.kindOf <a name="grunt-utils-kindof" href="#grunt-utils-kindof" title="Link to this section">⚑</a>
Return the "kind" of a value. Like `typeof` but returns the internal `[[Class]]` value. Possible results are `"number"`, `"string"`, `"boolean"`, `"function"`, `"regexp"`, `"array"`, `"date"`, `"error"`, `"null"`, `"undefined"` and the catch-all `"object"`.

```javascript
grunt.utils.kindOf(value)
```

### grunt.utils.linefeed <a name="grunt-utils-linefeed" href="#grunt-utils-linefeed" title="Link to this section">⚑</a>
The linefeed character, normalized for the current operating system. (`\r\n` on Windows, `\n` otherwise)

### grunt.utils.normalizelf <a name="grunt-utils-normalizelf" href="#grunt-utils-normalizelf" title="Link to this section">⚑</a>
Given a string, return a new string with all the linefeeds normalized for the current operating system. (`\r\n` on Windows, `\n` otherwise)

```javascript
grunt.utils.normalizelf(string)
```

### grunt.utils.recurse <a name="grunt-utils-recurse" href="#grunt-utils-recurse" title="Link to this section">⚑</a>
Recurse through nested objects and arrays, executing `callbackFunction` for each non-object value. If `continueFunction` returns `false`, a given object or value will be skipped.

```javascript
grunt.utils.recurse(object, callbackFunction, continueFunction)
```

See the [config lib source](../lib/grunt/config.js) for usage examples.

### grunt.utils.repeat <a name="grunt-utils-repeat" href="#grunt-utils-repeat" title="Link to this section">⚑</a>
Return string `str` repeated `n` times.

```javascript
grunt.utils.repeat(n, str)
```

### grunt.utils.pluralize <a name="grunt-utils-pluralize" href="#grunt-utils-pluralize" title="Link to this section">⚑</a>
Given `str` of `"a/b"`, If `n` is `1`, return `"a"` otherwise `"b"`. You can specify a custom separator if '/' doesn't work for you.

```javascript
grunt.utils.pluralize(n, str, separator)
```

### grunt.utils.spawn <a name="grunt-utils-spawn" href="#grunt-utils-spawn" title="Link to this section">⚑</a>
Spawn a child process, keeping track of its stdout, stderr and exit code. The method returns a reference to the spawned child. When the child exits, the done function is called.

```javascript
grunt.utils.spawn(options, doneFunction)
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


### grunt.utils.toArray <a name="grunt-utils-toarray" href="#grunt-utils-toarray" title="Link to this section">⚑</a>
Given an array or array-like object, return an array. Great for converting `arguments` objects into arrays.

```javascript
grunt.utils.toArray(arrayLikeObject)
```

## Internal libraries <a name="internal-libraries" href="#internal-libraries" title="Link to this section">⚑</a>

### grunt.utils.namespace <a name="grunt-utils-namespace" href="#grunt-utils-namespace" title="Link to this section">⚑</a>
An internal library for resolving deeply-nested properties in objects.

### grunt.utils.task <a name="grunt-utils-task" href="#grunt-utils-task" title="Link to this section">⚑</a>
An internal library for task running.


## External libraries <a name="external-libraries" href="#external-libraries" title="Link to this section">⚑</a>

### grunt.utils._ <a name="grunt-utils" href="#grunt-utils" title="Link to this section">⚑</a>
[Underscore.js](http://underscorejs.org/) - Tons of super-useful array, function and object utility methods.
[Underscore.string](https://github.com/epeli/underscore.string) - Tons of string utility methods.

Note that Underscore.string is mixed into `grunt.utils._` but is also available as `grunt.utils._.str` for methods that conflict with existing Underscore.js methods.

### grunt.utils.async <a name="grunt-utils-async" href="#grunt-utils-async" title="Link to this section">⚑</a>
[Async](https://github.com/caolan/async) - Async utilities for node and the browser.

### grunt.utils.hooker <a name="grunt-utils-hooker" href="#grunt-utils-hooker" title="Link to this section">⚑</a>
[JavaScript Hooker](https://github.com/cowboy/javascript-hooker) - Monkey-patch (hook) functions for debugging and stuff.

