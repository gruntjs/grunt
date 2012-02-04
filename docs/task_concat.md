[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# The `concat` task

This task is a [basic task](tasks_creating.md), and very simple. It concatenates one or more files (plus an optional banner) into an output file.

In this example [configuration][configuring.md], the command `grunt concat` will concatenate three source files, in order, writing the output to `dist/built.js`.

```javascript
/*global config:true, task:true*/
config.init({
  concat: {
    'dist/built.js': ['src/intro.js', 'src/project.js', 'src/outro.js']
  }
});
```

In this example, `grunt concat` will first strip any pre-existing banner comment from the `src/project.js` file, then concatenated that with a newly-generated banner comment, writing the output to `dist/built.js`. This banner will be the contents of the `meta.banner` string interpolated (in this case) with values "imported" from the `package.json` file.

```javascript
/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
  meta: {
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= template.today("m/d/yyyy") %> /*'
  },
  concat: {
    'dist/built.js': ['<banner>', '<file_strip_banner:src/project.js>']
  }
});
```

In this example, `grunt concat` will build two separate files. One "basic" version, with the main file essentially just copied to the distribution directory, and another "with_extras" version that has two files concatenated together.

While each concat target can be built individually by running `grunt concat:dist/basic.js` or `grunt concat:dist/with_extras.js`, since concat is a [basic task](tasks_creating.md), running `grunt concat` will build all concat targets.

```javascript
/*global config:true, task:true*/
config.init({
  concat: {
    'dist/basic.js': ['src/main.js'],
    'dist/with_extras.js': ['src/main.js', 'src/extras.js']
  }
});
```
