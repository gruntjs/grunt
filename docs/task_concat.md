[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# concat (built-in task)
Concatenate one or more input files (and/or [directives](helpers_directives.md) output, like `<banner>`) into an output file.

## About

This task is a [multi task](tasks_creating.md), meaning that grunt will automatically iterate over all `concat` targets if a target is not specified.

_Need some help getting started with grunt? See the [configuring grunt](configuring.md) page._

## Usage examples

### Concatenating multiple files

In this example, `grunt concat:dist` (or `grunt concat` because it's a [multi task](tasks_creating.md)) will simply concatenate three source files, in order, writing the output to `dist/built.js`.

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    }
  });

};
```

### Banner comments

In this example, `grunt concat:dist` (or `grunt concat` because it's a [multi task](tasks_creating.md)) will first strip any pre-existing banner comment from the `src/project.js` file, then concatenate that with a newly-generated banner comment, writing the output to `dist/built.js`.

This generated banner will be the contents of the `meta.banner` underscore template string interpolated (in this case) with values imported from the `package.json` file (which are available via the `pkg` config property) plus today's date.

_Note: you don't have to use an external `.json` file. You could just have additional `meta` sub-properties that are referenced in the banner template like `meta.foo`. Also, you can specify the config property that `<banner>` uses. See the [directives](helpers_directives.md) page for more information on directives and their options._

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("m/d/yyyy") %> */'
    },
    concat: {
      dist: {
        src: ['<banner>', '<file_strip_banner:src/project.js>'],
        dest: 'dist/built.js'
      }
    }
  });

};
```

### Multiple build targets

In this example, `grunt concat` will build two separate files. One "basic" version, with the main file essentially just copied to `dist/basic.js`, and another "with_extras" concatenated version written to `dist/with_extras.js`.

While each concat target can be built individually by running `grunt concat:basic` or `grunt concat:extras`, running `grunt concat` will build all concat targets. This is because concat is a [multi task](tasks_creating.md).

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    concat: {
      basic: {
        src: ['src/main.js'],
        dest: 'dist/basic.js'
      },
      extras: {
        src: ['src/main.js', 'src/extras.js'],
        dest: 'dist/with_extras.js'
      }
    }
  });

};
```

### Dynamic filenames

Files can be generated dynamically by using `<% %>` delimted underscore templates as filenames. In this example, the `concat:dist` destination filename is generated from the `name` and `version` properties of the referenced `package.json` file through the `pkg` config property.

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    concat: {
      dist: {
        src: ['src/main.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
  });

};
```

## Helpers

A generic `concat` helper is available for use in any other task where file and/or directive concatenation might be useful. For example:

```javascript
var fooPlusBar = grunt.helper('concat', ['foo.txt', 'bar.txt']);
```

See the [concat task source](../tasks/concat.js) for more information.
