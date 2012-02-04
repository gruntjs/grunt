[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# Logging inside tasks and helpers

I wanted grunt to look pretty. As such, there are a LOT of logging methods, and a few useful patterns:

Note, all of the methods that actually log something are chainable.

* `log.write(msg)` - log msg, with no trailing newline
* `log.writeln(msg)` - log msg, with trailing newline
* `log.error(msg)` - if msg is omitted, logs ERROR in red, otherwise logs: >> msg, with trailing newline
* `log.ok(msg)` - if msg is omitted, logs OK in green, otherwise logs: >> msg, with trailing newline
* `log.subhead(msg)` - logs msg in bold, with trailing newline
* `log.writeflags(obj, prefix)` - logs a list of obj properties (good for debugging flags)
* `log.wordlist(arr)` - returns a comma-separated list of array items
* `log.debug` - logs a debugging message, only if `--debug` was specified.

Variations of `log`:

* `log.verbose` - contains all methods of `log` but only logs if `--verbose` was specified.
* `log.notverbose` - contains all methods of `log` but only logs if `--verbose` wasn't specified.
* `log.verbose.or` - reference to `log.notverbose`
* `log.notverbose.or` - reference to `log.verbose`

_Note: there are a few other internal logging methods, which have been omitted from this list._

A common pattern is to only log when in `--verbose` mode OR if an error occurs, like so:

```javascript
task.registerHelper('something', function(arg) {
  var result;
  var msg = 'Doing something...';
  verbose.write(msg);
  try {
    result = doSomethingThatThrowsAnExceptionOnError(arg);
    // Success!
    verbose.ok();
    return result;
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg).error().error(e.message);
    fail.warn('Something went wrong.', 50);
  }
});
```

An explanation of the above code:

1. `verbose.write(msg);` logs the message (no newline), but only in `--verbose` mode.
2. `verbose.ok();` logs OK in green, with a newline.
3. `verbose.or.write(msg).error().error(e.message);` does a few things:
  1. `verbose.or.write(msg)` logs the message (no newline) if not in `--verbose` mode, and returns the `notverbose` object.
  2. `.error()` logs ERROR in red, with a newline, and returns the `notverbose` object.
  3. `.error(e.message);` logs the actual error message (and returns the `notverbose` object).
4. `fail.warn('Something went wrong.', 50);` logs a warning in bright yellow, existing grunt with exit code 50, unless `--force` was specified.

You can write crazy logging chains, omg!
