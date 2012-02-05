[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# concat (built-in task)
Concatenate one or more input files (and/or [directives](helpers_directives.md) output, like `<banner>`) into an output file.

## About

This task is a [basic task](tasks_creating.md), meaning that grunt will automatically iterate over all `concat` targets if no specific target is specified.

For more information on general configuration options, see the [configuring grunt](configuring.md) page.

## Usage examples

### Concatenating multiple files

In this example, `grunt concat` will simply concatenate three source files, in order, writing the output to `dist/built.js`.

```javascript
/*global config:true, task:true*/
config.init({
  concat: {
    'dist/built.js': ['src/intro.js', 'src/project.js', 'src/outro.js']
  }
});
```

### Banner comments

In this example, `grunt concat` will first strip any pre-existing banner comment from the `src/project.js` file, then concatenate that with a newly-generated banner comment, writing the output to `dist/built.js`.

This generated banner will be the contents of the `meta.banner` mustache template string interpolated (in this case) with values imported from the `package.json` file (which are available via the `pkg` config property) plus today's date.

_Note: you don't have to use an external `.json` file. You could just have additional `meta` sub-properties that are referenced in the banner template like `meta.foo`. Also, you can specify the config property that `<banner>` uses. See the [directives](helpers_directives.md) page for more information on directives and their options._

```javascript
/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
  meta: {
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= template.today("m/d/yyyy") %> */'
  },
  concat: {
    'dist/built.js': ['<banner>', '<file_strip_banner:src/project.js>']
  }
});
```

### Multiple build targets

In this example, `grunt concat` will build two separate files. One "basic" version, with the main file essentially just copied to `dist/basic.js`, and another "with_extras" concatenated version written to `dist/with_extras.js`.

While each concat target can be built individually by running `grunt concat:dist/basic.js` or `grunt concat:dist/with_extras.js`, running `grunt concat` will build all concat targets. This is because concat is a [basic task](tasks_creating.md).

```javascript
/*global config:true, task:true*/
config.init({
  concat: {
    'dist/basic.js': ['src/main.js'],
    'dist/with_extras.js': ['src/main.js', 'src/extras.js']
  }
});
```

## Helpers

A generic `concat` helper is available for use in any other task where file and/or directive concatenation might be useful. For example:

```javascript
var fooPlusBar = task.helper('concat', ['foo.txt', 'bar.txt']);
```

See the [concat task source](https://github.com/cowboy/grunt/blob/master/tasks/concat.js) for more information.
