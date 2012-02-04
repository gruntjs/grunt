[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# Helpers and Directives

## Helpers
Helpers are just utility functions, exposed through the `task` global variable, so that they can be used by tasks in other files.

It's not much more complex than this:

```javascript
task.registerHelper('foo', function(a, b) {
  return a + b;
});

task.helper('foo', 2, 3) // 5
```

For example, in the [min](https://github.com/cowboy/grunt/blob/master/tasks/min.js) task, the majority of the actual minification work is done in an `uglify` helper, so that other tasks can utilize that code if they need to.

Take a look at the [built-in tasks](https://github.com/cowboy/grunt/tree/master/tasks) for more examples.

## Directives
Directives are essentially string placeholders for helper functions, specified as values in the [configuration object](configuring.md). It's not as crazy as it sounds.

A good example of directives would be the `<json:package.json>` and `<config:lint.files>` directives in grunt's own [grunt.js gruntfile](https://github.com/cowboy/grunt/blob/master/grunt.js). Or the `<banner>` and `<file_strip_banner:src/grunt-jquery-example.js>` directives in the [sample jQuery plugin gruntfile](https://github.com/cowboy/grunt-jquery-example/blob/master/grunt.js).

In brief, when a directive like `<foo>` is encountered, the `foo` helper is executed, and its return value is used in place of the directive string. If `<foo:bar:baz>` is encountered, the `foo` helper is executed, with arguments `"bar"` and `"baz"` passed in.

Some of the built-in directives:

* `<config:prop.subprop>` - expand to the prop.subprop config property. Great for DRYing up file lists.
* `<json:file.json>` - expand to the object parsed from file.json (a valid JSON file).
* `<banner>` - the string in config property `meta.banner`, parsed via [Underscore.JS template](http://underscorejs.org/#template), using `<% %>` delimiters.
* `<banner:prop.subprop>` - same as above, but using a custom config property.
* `<file_strip_banner:file.js>` - expand to the given file, with any leading /*...*/ banner stripped.

Take a look at the [example gruntfiles](example_gruntfiles.md) for more configuration examples.
