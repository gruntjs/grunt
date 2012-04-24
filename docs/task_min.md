[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# min (built-in task)
Minify files with [UglifyJS][uglify].

[uglify]: https://github.com/mishoo/UglifyJS/

## About <a name="about" href="#about" title="Link to this section">#</a>

This task is a [multi task](types_of_tasks.md), meaning that grunt will automatically iterate over all `min` targets if a target is not specified.

_Need some help getting started with grunt? Visit the [getting started](getting_started.md) page. And if you're creating your own tasks or helpers, be sure to check out the [types of tasks](types_of_tasks.md) page as well as the [API documentation](api.md)._

## A Very Important Note <a name="a-very-important-note" href="#a-very-important-note" title="Link to this section">#</a>
Your Gruntfile **must** contain this code, once and **only** once. If it doesn't, grunt won't work. For the sake of brevity, this "wrapper" code has been omitted from all examples on this page, but it needs to be there.

```javascript
module.exports = function(grunt) {
  // Your grunt code goes in here.
};
```

## Project configuration <a name="project-configuration" href="#project-configuration" title="Link to this section">#</a>

This example shows a brief overview of the [config](api_config.md) properties used by the `min` task. For a more in-depth explanation, see the usage examples.

```javascript
// Project configuration.
grunt.initConfig({
  // Project metadata, used by the <banner> directive.
  meta: {},
  // Lists of files to be minified with UglifyJS.
  min: {}
});
```

## Usage examples <a name="usage-examples" href="#usage-examples" title="Link to this section">#</a>

### Minifying individual files <a name="minifying-individual-files" href="#minifying-individual-files" title="Link to this section">#</a>

In this example, running `grunt min:dist` (or `grunt min` because `min` is a [multi task](types_of_tasks.md)) will minify the specified source file, writing the output to `dist/built.min.js`.

_Note that UglifyJS strips all comments from the source, including banner comments. See the "Banner comments" example for instructions on how to add a banner to the generated source._

```javascript
// Project configuration.
grunt.initConfig({
  min: {
    dist: {
      src: ['dist/built.js'],
      dest: 'dist/built.min.js'
    }
  }
});
```

### Minifying while concatenating files <a name="minifying-while-concatenating-files" href="#minifying-while-concatenating-files" title="Link to this section">#</a>

In this example, running `grunt min:dist` (or `grunt min` because `min` is a [multi task](types_of_tasks.md)) will first concatenate the three specified source files, in order, minifying the result and writing the output to `dist/built.min.js`.

_Note that UglifyJS strips all comments from the source, including banner comments. See the "Banner comments" example for instructions on how to add a banner to the generated source._

```javascript
// Project configuration.
grunt.initConfig({
  min: {
    dist: {
      src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
      dest: 'dist/built.min.js'
    }
  }
});
```

With a slight modification, running `grunt min` will join the specified source files using `;` instead of the default newline character before minification.

```javascript
// Project configuration.
grunt.initConfig({
  min: {
    dist: {
      src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
      dest: 'dist/built.min.js',
      separator: ';'
    }
  }
});
```

### Minifying and concatenating separately <a name="minifying-and-concatenating-separately" href="#minifying-and-concatenating-separately" title="Link to this section">#</a>

Often, it's desirable to create both unminified and minified distribution files. In these cases, the [concat task](task_concat.md) should be run first, followed by the `min` task.

In this example, running `grunt concat:dist min:dist` (or `grunt concat min` because both `concat` and `min` are [multi tasks](types_of_tasks.md)) will first concatenate the three specified source files, in order, writing the output to `dist/built.js`. After that, grunt will minify the newly-created file, writing the output to `dist/built.min.js`.

_Note that UglifyJS strips all comments from the source, including banner comments. See the "Banner comments" example for instructions on how to add a banner to the generated source._

```javascript
// Project configuration.
grunt.initConfig({
  concat: {
    dist: {
      src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
      dest: 'dist/built.js'
    }
  },
  min: {
    dist: {
      src: ['dist/built.js'],
      dest: 'dist/built.min.js'
    }
  }
});
```

### Banner comments <a name="banner-comments" href="#banner-comments" title="Link to this section">#</a>

In this example, running `grunt min:dist` (or `grunt min` because `min` is a [multi task](types_of_tasks.md)) will first strip any preexisting comments from the `src/project.js` file (because that's how UglifyJS works), then concatenate the result with a newly-generated banner comment, writing the output to `dist/built.js`.

This generated banner will be the contents of the `meta.banner` underscore template string interpolated with the config object. In this case, those properties are the values imported from the `package.json` file (which are available via the `pkg` config property) plus today's date.

_Note: you don't have to use an external JSON file. It's completely valid to create the `pkg` object inline in the config. That being said, if you already have a JSON file, you might as well reference it. See the [directives](helpers_directives.md) page for more information on the `<banner>` and `<json>` directives and their options._

```javascript
// Project configuration.
grunt.initConfig({
  pkg: '<json:package.json>',
  meta: {
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */'
  },
  min: {
    dist: {
      src: ['<banner>', 'dist/built.js'],
      dest: 'dist/built.min.js'
    }
  }
});
```

### Specifying UglifyJS options <a name="specifying-uglifyjs-options" href="#specifying-uglifyjs-options" title="Link to this section">#</a>

In this example, custom UglifyJS `mangle`, `squeeze` and `codegen` options are specified. The listed methods and their expected options are explained in the API section of the [UglifyJS documentation][uglify]:

* The `mangle` object is passed into the `pro.ast_mangle` method.
* The `squeeze` object is passed into the `pro.ast_squeeze` method.
* The `codegen` object is passed into the `pro.gen_code` method.

```javascript
// Project configuration.
grunt.initConfig({
  min: {
    dist: {
      src: ['dist/built.js'],
      dest: 'dist/built.min.js'
    }
  },
  uglify: {
    mangle: {toplevel: true},
    squeeze: {dead_code: false},
    codegen: {quote_keys: true}
  }
});
```

## Helpers <a name="helpers" href="#helpers" title="Link to this section">#</a>

A generic `uglify` helper is available for use in any other task where file minification might be useful. For example:

```javascript
var src = grunt.file.read('example.js');
var minSrc = grunt.helper('uglify', {mangle: {except: ['zomg']}});
```

A generic `gzip` helper is available for use in any other task where gzipped text might be useful. For example:

```javascript
var src = grunt.file.read('example.js');
var gzipSrc = grunt.helper('gzip', src);
grunt.log.writeln('Original size: ' + src.length + ' bytes.');
grunt.log.writeln('Gzipped size: ' + gzipSrc.length + ' bytes.');
```

To this end, a specialized `min_max_info` helper is available for use in any other task where before-compression & after-compression sizes need to be logged. For example:

```javascript
var src = grunt.file.read('example.js');
var minSrc = grunt.helper('uglify', {mangle: {except: ['zomg']}});
grunt.helper('min_max_info', minSrc, src);
```

See the [min task source](../tasks/min.js) for more information.
