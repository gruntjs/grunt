[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.log, grunt.verbose

Output messages to the console.

See the [log lib source](../lib/grunt/log.js) for more information.

## The log API <a name="the-log-api" href="#the-log-api" title="Link to this section">⚑</a>
Grunt output should look consistent, and maybe even pretty. As such, there is a plethora of logging methods, and a few useful patterns. All of the methods that actually log something are chainable.

_Note: all methods available under `grunt.verbose` work exactly like `grunt.log` methods, but only log if the `--verbose` command-line option was specified._

### grunt.log.write / grunt.verbose.write <a name="grunt-log-write-grunt-verbose-write" href="#grunt-log-write-grunt-verbose-write" title="Link to this section">⚑</a>
Log the specified `msg` string, with no trailing newline.

```javascript
grunt.log.write(msg)
```

### grunt.log.writeln / grunt.verbose.writeln <a name="grunt-log-writeln-grunt-verbose-writeln" href="#grunt-log-writeln-grunt-verbose-writeln" title="Link to this section">⚑</a>
Log the specified `msg` string, with trailing newline.

```javascript
grunt.log.writeln([msg])
```

### grunt.log.error / grunt.verbose.error <a name="grunt-log-error-grunt-verbose-error" href="#grunt-log-error-grunt-verbose-error" title="Link to this section">⚑</a>
If `msg` string is omitted, logs `ERROR` in red, otherwise logs `>> msg`, with trailing newline.

```javascript
grunt.log.error([msg])
```

### grunt.log.ok / grunt.verbose.ok <a name="grunt-log-ok-grunt-verbose-ok" href="#grunt-log-ok-grunt-verbose-ok" title="Link to this section">⚑</a>
If `msg` string is omitted, logs `OK` in green, otherwise logs `>> msg`, with trailing newline.

```javascript
grunt.log.ok([msg])
```

### grunt.log.subhead / grunt.verbose.subhead <a name="grunt-log-subhead-grunt-verbose-subhead" href="#grunt-log-subhead-grunt-verbose-subhead" title="Link to this section">⚑</a>
Log the specified `msg` string in **bold**, with trailing newline.

```javascript
grunt.log.subhead(msg)
```

### grunt.log.writeflags / grunt.verbose.writeflags <a name="grunt-log-writeflags-grunt-verbose-writeflags" href="#grunt-log-writeflags-grunt-verbose-writeflags" title="Link to this section">⚑</a>
Log a list of `obj` properties (good for debugging flags).

```javascript
grunt.log.writeflags(obj, prefix)
```

### grunt.log.debug / grunt.verbose.debug <a name="grunt-log-debug-grunt-verbose-debug" href="#grunt-log-debug-grunt-verbose-debug" title="Link to this section">⚑</a>
Logs a debugging message, but only if the `--debug` command-line option was specified.

```javascript
grunt.log.debug(msg)
```

## Verbose and Notverbose <a name="verbose-and-notverbose" href="#verbose-and-notverbose" title="Link to this section">⚑</a>
All logging methods available under `grunt.verbose` work exactly like their `grunt.log` counterparts, but only log if the `--verbose` command-line option was specified. There is also a "notverbose" counterpart available at both `grunt.log.notverbose` and `grunt.log.verbose.or`. In fact, the `.or` property can be used on both `verbose` and `notverbose` to effectively toggle between the two.

### grunt.verbose / grunt.log.verbose <a name="grunt-verbose-grunt-log-verbose" href="#grunt-verbose-grunt-log-verbose" title="Link to this section">⚑</a>
This object contains all methods of `grunt.log` but only logs if the `--verbose` command-line option was specified.

```javascript
grunt.verbose
```

### grunt.verbose.or / grunt.log.notverbose <a name="grunt-verbose-or-grunt-log-notverbose" href="#grunt-verbose-or-grunt-log-notverbose" title="Link to this section">⚑</a>
This object contains all methods of `grunt.log` but only logs if the `--verbose` command-line option was _not_ specified.

```javascript
grunt.verbose.or
```

## Utility Methods <a name="utility-methods" href="#utility-methods" title="Link to this section">⚑</a>
These methods don't actually log, they just return strings that can be used in other methods.

### grunt.log.wordlist <a name="grunt-log-wordlist" href="#grunt-log-wordlist" title="Link to this section">⚑</a>
Returns a comma-separated list of `arr` array items.

```javascript
grunt.log.wordlist(arr)
```

### grunt.log.uncolor <a name="grunt-log-uncolor" href="#grunt-log-uncolor" title="Link to this section">⚑</a>
Removes all color information from a string, making it suitable for testing `.length` or perhaps logging to a file.

```javascript
grunt.log.uncolor(str)
```

### grunt.log.wraptext <a name="grunt-log-wraptext" href="#grunt-log-wraptext" title="Link to this section">⚑</a>
Wrap `text` string to `width` characters with `\n`, ensuring that words are not split in the middle unless absolutely necessary.

```javascript
grunt.log.wraptext(width, text)
```

### grunt.log.table <a name="grunt-log-table" href="#grunt-log-table" title="Link to this section">⚑</a>
Wrap `texts` array of strings to columns `widths` characters wide. A wrapper for the `grunt.log.wraptext` method that can be used to generate output in columns.

```javascript
grunt.log.table(widths, texts)
```


## An Example <a name="an-example" href="#an-example" title="Link to this section">⚑</a>

A common pattern is to only log when in `--verbose` mode OR if an error occurs, like so:

```javascript
grunt.registerHelper('something', function(arg) {
  var result;
  var msg = 'Doing something...';
  grunt.verbose.write(msg);
  try {
    result = doSomethingThatThrowsAnExceptionOnError(arg);
    // Success!
    grunt.verbose.ok();
    return result;
  } catch(e) {
    // Something went wrong.
    grunt.verbose.or.write(msg).error().error(e.message);
    grunt.fail.warn('Something went wrong.', 50);
  }
});
```

An explanation of the above code:

1. `grunt.verbose.write(msg);` logs the message (no newline), but only in `--verbose` mode.
2. `grunt.verbose.ok();` logs OK in green, with a newline.
3. `grunt.verbose.or.write(msg).error().error(e.message);` does a few things:
  1. `grunt.verbose.or.write(msg)` logs the message (no newline) if not in `--verbose` mode, and returns the `notverbose` object.
  2. `.error()` logs ERROR in red, with a newline, and returns the `notverbose` object.
  3. `.error(e.message);` logs the actual error message (and returns the `notverbose` object).
4. `grunt.fail.warn('Something went wrong.', 50);` logs a warning in bright yellow, exiting grunt with exit code 50, unless `--force` was specified.

Take a look at the [built-in tasks source code](../tasks) for more examples.
