[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.config

Access project-specific configuration data defined in the [grunt.js gruntfile](configuring.md).

See the [config lib source](../lib/grunt/config.js) for more information.

## The config API

Note that any method marked with a ☃ (unicode snowman) is available directly on the `grunt` object in addition to being available on the `grunt.config` object. Just so you know. See the [API main page](api.md) for more usage information.

## Initializing Config Data
_Note that the method listed below is also available on the `grunt` object as [grunt.initConfig](api.md)._

### grunt.config.init ☃
Initialize a configuration object for the current project. The specified `configObject` is used by tasks and helpers and can also be accessed using the `grunt.config` method. Nearly every project's [grunt.js gruntfile](configuring.md) will call this method.

Note that any specified `<config>` and `<json>` [directives](api_task.md) will be automatically processed when the config object is initialized.

```javascript
grunt.config.init(configObject)
```

This example contains sample config data for the [lint task](task_lint.md):

```javascript
grunt.config.init({
  lint: {
    all: ['lib/*.js', 'test/*.js', 'grunt.js']
  }
});
```

See the [configuring grunt](configuring.md) page for more configuration examples.

_This method is also available as [grunt.initConfig](api.md)._


## Accessing Config Data
EXPLAIN PROPS

### grunt.config
This method serves as an alias to the `grunt.config.get` and `grunt.config.set` methods. If two arguments are passed, `grunt.config.set` is called, otherwise `grunt.config.get` is called.

```javascript
grunt.config([prop [, value]])
```

### grunt.config.get
If `prop` is specified, that property's value is returned, or `null` if that property is not defined. If `prop` isn't specified, a copy of the entire config object is returned.

Any `<% %>` templates in returned values will not be automatically processed, but can be processed afterwards using the [template.process](api_template.md) method. Or the `grunt.config.process` method can be used to do both at once.

```javascript
grunt.config.get([prop])
```

### grunt.config.set
METHOD_DESCRIPTION

Note that any specified `<config>` and `<json>` [directives](api_task.md) will be automatically processed when the config data is set.

```javascript
grunt.config.set()
```

### grunt.config.process
METHOD_DESCRIPTION

```javascript
grunt.config.process()
```

## Requiring Config Data

### grunt.config.requires
METHOD_DESCRIPTION

```javascript
grunt.config.requires()
```
