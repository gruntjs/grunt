[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.config

Access project-specific configuration data defined in the [Gruntfile](getting_started.md).

See the [config lib source](../lib/grunt/config.js) for more information.

## The config API

Note that any method marked with a ☃ (unicode snowman) is also available directly on the `grunt` object, and any method marked with a ☆ (white star) is also available inside tasks on the `this` object. Just so you know. See the [API main page](api.md) for more usage information.

## Initializing Config Data
_Note that the method listed below is also available on the `grunt` object as [grunt.initConfig](api.md)._

### grunt.config.init ☃
Initialize a configuration object for the current project. The specified `configObject` is used by tasks and can be accessed using the `grunt.config` method. Nearly every project's [Gruntfile](getting_started.md) will call this method.

```javascript
grunt.config.init(configObject)
```

Note that any specified `<% %>` [template strings](api_template.md) will only be processed when config data is retrieved.

This example contains sample config data for the [lint task](task_lint.md):

```javascript
grunt.config.init({
  lint: {
    all: ['lib/*.js', 'test/*.js', 'Gruntfile.js']
  }
});
```

See the [configuring grunt](getting_started.md) page for more configuration examples.

_This method is also available as [grunt.initConfig](api.md)._


## Accessing Config Data
The following methods allow grunt configuration data to be accessed either via dot-delimited string like `'pkg.author.name'` or via array of property name parts like `['pkg', 'author', 'name']`.

Note that if a specified property name contains a `.` dot, it must be escaped with a literal backslash, eg. `'concat.dist/built\\.js'`. If an array of parts is specified, grunt will handle the escaping internally with the `grunt.config.escape` method.

### grunt.config
Get or set a value from the project's grunt configuration. This method serves as an alias to other methods; if two arguments are passed, `grunt.config.set` is called, otherwise `grunt.config.get` is called.

```javascript
grunt.config([prop [, value]])
```

### grunt.config.get
Get a value from the project's grunt configuration. If `prop` is specified, that property's value is returned, or `null` if that property is not defined. If `prop` isn't specified, a copy of the entire config object is returned.

```javascript
grunt.config.get([prop])
```

#### Recursive template processing
Note that any `<% %>` [template strings](api_template.md) will be recursively processed via the [grunt.template.process](api_template.md) method. Raw values can be accessed via the `grunt.config.getRaw` method.

If any retrieved value is entirely a single `'<%= foo %>'` or `'<%= foo.bar %>'` template string, and the specified `foo` or `foo.bar` property is a non-string (and not `null` or `undefined`) value, it will be expanded to the _actual_ value. That, combined with the fact that the [grunt.file.expand](api_file.md) method will automatically flatten arrays, can be extremely useful.

For example:

```javascript
grunt.initConfig({
  basename: 'foo',
  extension: 'txt',
  file: '<%= basename %>.<%= extension %>',
  files: ['<%= file %>', 'bar.txt'],
  files2: ['<%= files %>', 'baz.txt']
});

grunt.config.get('file')   // 'foo.txt'
grunt.config.get('files')  // ['foo.txt', 'bar.txt']
grunt.config.get('files2') // [['foo.txt', 'bar.txt'], 'baz.txt']
```

### grunt.config.getRaw
Get a value from the project's grunt configuration. If `prop` is specified, that property's value is returned, or `null` if that property is not defined. If `prop` isn't specified, a copy of the entire config object is returned.

```javascript
grunt.config.getRaw([prop])
```

Note that any specified `<% %>` [template strings](api_template.md) will NOT be processed when config data is retrieved via this method.

### grunt.config.set
Set a value into the project's grunt configuration.

```javascript
grunt.config.set(prop, value)
```

Note that any specified `<% %>` [template strings](api_template.md) will only be processed when config data is retrieved.

### grunt.config.escape
Escape `.` dots in the given `propString`. This should be used for property names that contain dots.

```javascript
grunt.config.escape(propString)
```

## Requiring Config Data
_Note that the method listed below is also available inside tasks on the `this` object as [this.requiresConfig](api.md)._

### grunt.config.requires ☆
Fail the current task if one or more required config properties is missing, `null` or `undefined`. One or more string or array config properties may be specified.

```javascript
grunt.config.requires(prop [, prop [, ...]])
```

_This method is also available inside tasks as [this.requiresConfig](api.md)._
