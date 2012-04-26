[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.template

Underscore.js template processing and other template-related methods.

Template strings can be processed manually using the provided template functions. In addition, many tasks and helpers automatically expand `<% %>` style template strings specified inside the [Gruntfile](getting_started.md) when used as file paths and banners.

See the [template lib source](../lib/grunt/template.js) for more information.

## The template API <a name="the-template-api" href="#the-template-api" title="Link to this section">#</a>

### grunt.template.process <a name="grunt-template-process" href="#grunt-template-process" title="Link to this section">#</a>
Process an [Underscore.js template](http://underscorejs.org/#template) string. The `template` argument will be processed recursively until there are no more templates to process. If `data` is omitted, the entire [config object](api_config.md) is used.

The default template delimiters are `<% %>` but if `options.delimiters` is set to a valid delimiter name, those template delimiters will be used instead. See the `grunt.template.setDelimiters` method for a list of valid delimiter names.

```javascript
grunt.template.process(template, data, options)
```

Inside templates, the `grunt` object is exposed so that you can do things like `<%= grunt.template.today('yyyy') %>`. _Note that if the `data` object already has a `grunt` property, the `grunt` API will not be accessible in templates._

In this example, the `baz` property is processed recursively until there are no more `<% %>` templates to process.

```javascript
var obj = {
  foo: 'c',
  bar: 'b<%= foo %>d',
  baz: 'a<%= bar %>e'
};
grunt.template.process('<%= baz %>', obj) // 'abcde'
```

### grunt.template.setDelimiters <a name="grunt-template-setdelimiters" href="#grunt-template-setdelimiters" title="Link to this section">#</a>
Set the [Underscore.js template](http://underscorejs.org/#template) delimiters to a predefined set in case you `grunt.util._.template` needs to be called manually.

_You probably won't need to use this method, because you'll be using `grunt.template.process` which uses this method internally._

Valid names:

* `config` - use `<% %>` style delimiters (default)
* `init` - use `{% %}` style delimiters (reserved for [init task](task_init.md) templates)
* `user` - use `[% %]` style delimiters (not used internally in grunt)

```javascript
grunt.template.setDelimiters(name)
```

### grunt.template.addDelimiters <a name="grunt-template-adddelimiters" href="#grunt-template-adddelimiters" title="Link to this section">#</a>
Add a named set of [Underscore.js template](http://underscorejs.org/#template) delimiters. A few sets have already been added for your convenience, see the `grunt.template.setDelimiters` method for a list.

_You probably won't need to use this method, because the built-in delimiters should be sufficient._

```javascript
grunt.template.addDelimiters(name, opener, closer)
```

## Template Helpers <a name="template-helpers" href="#template-helpers" title="Link to this section">#</a>

### grunt.template.date <a name="grunt-template-date" href="#grunt-template-date" title="Link to this section">#</a>
Format a date using the [dateformat](https://github.com/felixge/node-dateformat) library.

```javascript
grunt.template.date(date, format)
```

In this example, a specific date is formatted as month/day/year.

```javascript
grunt.template.date(847602000000, 'yyyy-mm-dd') // '1996-11-10'
```

### grunt.template.today <a name="grunt-template-today" href="#grunt-template-today" title="Link to this section">#</a>
Format today's date using the [dateformat](https://github.com/felixge/node-dateformat) library.

```javascript
grunt.template.today(format)
```

In this example, today's date is formatted as a 4-digit year.

```javascript
grunt.template.today('yyyy') // '2012'
```

_(somebody remind me to update this date every year so the docs appear current)_
