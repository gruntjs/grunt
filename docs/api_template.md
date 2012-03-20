[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.template

Miscellaneous utilities, including Underscore.js, Async and Hooker.

See the [template lib source](../lib/grunt/template.js) for more information.

## Internal methods

### grunt.template.process
Process an [Underscore.js template](http://underscorejs.org/#template) string. If `data` is omitted, the entire [config object](api_config.md) is used. Templates are processed recursively until there are no more templates to process.

Inside templates, the `grunt` object is exposed as `grunt` so that you can do things like `<%= grunt.template.today('yyyy') %>`. _Note that if the `data` object has a `grunt` property, it will prevent this from working._

If `mode` is omitted, `<% %>` style template delimiters will be used. If `mode` is "init", `{% %}` style template delimiters will be used (this is specifically used by the [init task](task_init.md)).

```javascript
grunt.template.process(template, data, mode)
```

In this example, the `baz` property is processed recursively until there are no more `<% %>` templates to process.

```javascript
var obj = {
  foo: 'c',
  bar: 'b<%= foo %>d',
  baz: 'a<%= bar %>e'
};
template.process('<%= baz %>', obj) // 'abcde'
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
Format today's date using the [dateformat](https://github.com/felixge/node-dateformat) library.

```javascript
grunt.template.today(format)
```

In this example, today's date is formatted as a 4-digit year. Great for copyright notices in generated banners!

```javascript
grunt.template.today('yyyy') // '2012'
```
