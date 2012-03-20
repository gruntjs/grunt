[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.template

Miscellaneous utilities, including Underscore.js, Async and Hooker.

See the [template lib source](../lib/grunt/template.js) for more information.

## Internal methods

### grunt.template.process
Process an [Underscore.js template](http://underscorejs.org/#template) string. If `data` is omitted, the entire [config object](api_config.md) is used. Templates are processed recursively until there are no more templates to process.

Inside templates, the `grunt` object is exposed as `grunt` so that you can do things like `<%= grunt.template.today('mm/dd/yyyy') %>`. Note that if the `data` object has a `grunt` property, it will prevent this from working!

If `mode` is omitted, `<% %>` style template delimiters will be used. If `mode` is `'init'`, `{% %}` style template delimiters will be used (this is specifically used by the [init task](task_init.md)).

```javascript
grunt.template.process(template, data, mode)
```

### grunt.template.delimiters
FOO

```javascript
grunt.template.delimiters()
```

## Template Helpers

### grunt.template.stripBanner
FOO

```javascript
grunt.template.stripBanner()
```

### grunt.template.today
FOO

```javascript
grunt.template.today()
```
