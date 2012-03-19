[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md) | [Grunt API](api.md)

# The grunt API - grunt.utils


## Internal methods


### grunt.utils.kindOf
Return the "kind" of a value. Like `typeof` but returns the internal `[[Class]]` value. Possible results are `"number"`, `"string"`, `"boolean"`, `"function"`, `"regexp"`, `"array"`, `"date"`, `"error"`, `"null"`, `"undefined"` and the catch-all `"object"`.

```javascript
grunt.utils.kindOf(value)
```

### grunt.utils.linefeed


### grunt.utils.namespace


### grunt.utils.normalizelf


### grunt.utils.recurse


### grunt.utils.repeat


### grunt.utils.spawn


### grunt.utils.task


### grunt.utils.toArray


## External libraries

### grunt.utils._
[Underscore.js](http://underscorejs.org/) - Tons of super-useful array, function and object utility methods.
[Underscore.string](https://github.com/epeli/underscore.string) - Tons of string utility methods.

Note that Underscore.string is mixed into `grunt.utils._` but is also available as `grunt.utils._.str` for methods that might conflict with existing Underscore.js methods.

### grunt.utils.async
[Async utilities](https://github.com/caolan/async) - Async utilities for node and the browser.

### grunt.utils.hooker
[JavaScript hooker](https://github.com/cowboy/javascript-hooker) - Monkey-patch (hook) functions for debugging and stuff.

