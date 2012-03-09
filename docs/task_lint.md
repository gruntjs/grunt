[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# lint (built-in task)
Validate one or more input files with JSHint.

## About

This task is a [basic task](tasks_creating.md), meaning that grunt will automatically iterate over all `lint` targets if no specific target is specified.

For more information on general configuration options, see the [configuring grunt](configuring.md) page.

## Usage examples

### Wildcards

In this example, `grunt lint` will lint the project's gruntfile as well as all JavaScript files in the `lib` and `test` directories, using the default JSHint `options` and `globals`.

```javascript
/*global config:true, task:true*/
config.init({
  lint: {
    files: ['grunt.js', 'lib/*.js', 'test/*.js']
  }
});
```

With a slight modification, `grunt lint` will also lint all JavaScript files in the `lib` and `test` directories _and all subdirectories_. See the [minimatch](https://github.com/isaacs/minimatch) module's documentation for more details on wildcard patterns.

```javascript
/*global config:true, task:true*/
config.init({
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
  }
});
```

### Linting before and after concat

In this example, `grunt lint` will lint two separate sets of files using the default JSHint `options` and `globals`, one "beforeconcat" set, and one "afterconcat" set. Running `grunt lint` will lint both sets of files all at once, because lint is a [basic task](tasks_creating.md). This is not ideal, because `dist/output.js` might get linted before it gets created!

You really need to lint the "beforeconcat" set first, then concat, then lint the "afterconcat" set, by doing `grunt lint:beforeconcat concat lint:afterconcat`.

```javascript
/*global config:true, task:true*/
config.init({
  concat: {
    dist: {
      src: ['src/foo.js', 'src/bar.js'],
      dest: 'dist/output.js'
    }
  },
  lint: {
    beforeconcat: ['src/foo.js', 'src/bar.js'],
    afterconcat: ['dist/output.js']
  }
});
```

If this build process was something you did frequently, it would make sense to create an [alias task](tasks_creating.md) for it with a short name like "build" so that it can be run as `grunt build`. To make life even easier, naming that alias task "default" would allow you to run it with the command `grunt`.

```javascript
task.registerTask('default', 'lint:beforeconcat concat lint:afterconcat');
```

### Dynamic filenames

Building on the previous example, if you want to avoid duplication, you can use a [directive](helpers_directives.md) like `'<config:concat.dist.dest>'` in place of `'dist/output.js'` in the `afterconcat` lint target. This allows you to generate the output filename dynamically. In this example, the `concat:dist` destination filename is generated from the `name` and `version` properties of the referenced `package.json` file through the `pkg` config property.

```javascript
/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
  concat: {
    dist: {
      src: ['src/foo.js', 'src/bar.js'],
      dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
    }
  },
  lint: {
    beforeconcat: ['src/foo.js', 'src/bar.js'],
    afterconcat: ['<config:concat.dist.dest>']
  }
});
```

### Specifying JSHint options and globals

In this example, taken from the [Sample jQuery plugin gruntfile](https://github.com/cowboy/grunt-jquery-example/blob/master/grunt.js), custom JSHint `options` and `globals` are specified. These options are explained in the [JSHint documentation](http://www.jshint.com/options/).

_Note: config `jshint.options` and `jshint.globals` apply to the entire project, but can be overridden with per-file comments like `/*global config:true, task:true*/`._

```javascript
/*global config:true, task:true*/
config.init({
  lint: {
    files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
  },
  jshint: {
    options: {
      curly: true,
      eqeqeq: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      sub: true,
      undef: true,
      eqnull: true,
      browser: true
    },
    globals: {
      jQuery: true
    }
  }
});
```

#### Per-target JSHint options and globals

For each `lint` target, grunt looks for a target-named object underneath the `jshint` config object. If this object is found, its `options` and `globals` sub-objects will be used instead of the global ones. this allows per-lint-target JSHint options/globals overrides.

In this example, there are default JSHint settings, as well as per-target overrides:

```javascript
config.init({
  lint: {
    src: 'src/*.js',
    grunt: 'grunt.js',
    tests: 'tests/unit/**/*.js'
  },
  jshint: {
    // Defaults.
    options: {curly: true},
    globals: {},
    // Just for the lint:grunt target.
    grunt: {
      options: {node: true},
      globals: {task: true, config: true, file: true, log: true, template: true}
    },
    // Just for the lint:src target.
    src: {
      options: {browser: true},
      globals: {jQuery: true}
    },
    // Just for the lint:tests target.
    tests: {
      options: {jquery: true},
      globals: {module: true, test: true, ok: true, equal: true, deepEqual: true, QUnit: true}
    }
  }
});
```

## Helpers

A generic `lint` helper is available for use in any other task where file linting might be useful. For example:

```javascript
var filename = 'example.js';
var src = file.read(filename);
task.helper('lint', src, {browser: true}, {jQuery: true}, filename);
```

See the [lint task source](https://github.com/cowboy/grunt/blob/master/tasks/lint.js) for more information.
