[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# concat (built-in task)
Concatenate one or more input files (and/or [directives](helpers_directives.md) output, like `<banner>`) into an output file.

## About

This task is a [multi task](tasks_creating.md), meaning that grunt will automatically iterate over all `concat` targets if a target is not specified.

_Need some help getting started with grunt? See the [configuring grunt](configuring.md) page._

## Usage examples

### Concatenating multiple files

Given this example [gruntfile](configuring.md), running `grunt concat:dist` (or `grunt concat` because `concat` is a [multi task](tasks_creating.md)) will simply concatenate the three specified source files, in order, writing the output to `dist/built.js`.

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

Given this example [gruntfile](configuring.md), running `grunt concat:dist` (or `grunt concat` because `concat` is a [multi task](tasks_creating.md)) will first strip any preexisting banner comment from the `src/project.js` file, then concatenate the result with a newly-generated banner comment, writing the output to `dist/built.js`.

This generated banner will be the contents of the `meta.banner` underscore template string interpolated with the config object. In this case, those properties are the values imported from the `package.json` file, which are available via the `pkg` config property, plus today's date.

_Note: you don't have to use an external JSON file. It's completely valid to create the `pkg` object inline in the config. That being said, if you already have a JSON file, you might as well reference it. See the [directives](helpers_directives.md) page for more information on the `<banner>` and `<json>` directives and their options._

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

Given this example [gruntfile](configuring.md), running `grunt concat` will build two separate files. One "basic" version, with the main file essentially just copied to `dist/basic.js`, and another "with_extras" concatenated version written to `dist/with_extras.js`.

While each concat target can be built individually by running `grunt concat:basic` or `grunt concat:extras`, running `grunt concat` will build all concat targets. This is because `concat` is a [multi task](tasks_creating.md).

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

Filenames can be generated dynamically by using `<%= %>` delimited underscore templates as filenames.

Given this example [gruntfile](configuring.md), running `grunt concat:dist` generates a destination file whose name is generated from the `name` and `version` properties of the referenced `package.json` file (via the `pkg` config property).

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

Given this more involved example [gruntfile](configuring.md), running `grunt concat` will build two separate files (because `concat` is a [multi task](tasks_creating.md)). The destination file paths will be expanded dynamically based on the specified underscore templates, recursively if necessary.

For example, if the `package.json` file contained `{"name": "awesome", "version": "1.0.0"}`, the files `dist/awesome/1.0.0/basic.js` and `dist/awesome/1.0.0/with_extras.js` would be generated.

```javascript
exports.config = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    dirs: {
      src: 'src/files',
      dest: 'dist/<%= pkg.name %>/<%= pkg.version %>'
    },
    concat: {
      basic: {
        src: ['<%= dirs.src %>/main.js'],
        dest: '<%= dirs.dest %>/basic.js'
      },
      extras: {
        src: ['<%= dirs.src %>/main.js', '<%= dirs.src %>/extras.js'],
        dest: '<%= dirs.dest %>/with_extras.js'
      }
    }
  });

};
```

## Helpers

A generic `concat` helper is available for use in any other task where file and/or [directive](helpers_directives.md) concatenation might be useful. For example:

```javascript
var fooPlusBar = grunt.helper('concat', ['foo.txt', 'bar.txt']);
```

See the [concat task source](../tasks/concat.js) for more information.
