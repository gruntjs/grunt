[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# The grunt API

In an effort to make development easier, grunt exposes a lot of its functionality as globals.

## Internals

* `utils` - miscellaneous utilities
* `task` - the entire task interface
* `file` - glob expansion, file reading, writing, directory traversing
* `fail` - more serious than error logging, `fail.warn` and `fail.fatal` will halt everything
* `config` - reading values from the grunt configuration
* `option` - reading values from the command-line options
* `log` - don't use `console.log`, use `log.writeln` instead! [More info on log](api_log.md).
* `verbose` - just like `log`, but only logs if `--verbose` was specified. [More info on verbose](api_log.md).

## External libraries, exposed

* `utils.async` - [Async utilities](https://github.com/caolan/async)
* `utils._` - [Underscore.js](http://underscorejs.org/), including [Underscore.string](https://github.com/epeli/underscore.string)
* `utils.hooker` - [JavaScript hooker](https://github.com/cowboy/javascript-hooker)

Unfortunately, I haven't documented everything yet. Fortunately, the source is open and browsable. Have fun!
