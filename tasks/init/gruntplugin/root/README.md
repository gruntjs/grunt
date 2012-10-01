# {%= name %}

> {%= description %}

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

Install this grunt plugin next to your project's [Gruntfile][Getting Started] with the following command. This will also add the plugin to your project's `package.json` file as a `devDependency`.

```
npm install {%= name %} --save-dev
```

Then add this line to your project's Gruntfile:

```javascript
grunt.loadNpmTasks('{%= name %}');
```

If the plugin was installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task(s) as a local Npm module task.

[grunt]: https://github.com/cowboy/grunt
[Getting Started]: https://github.com/cowboy/grunt/blob/devel/docs/getting_started.md

## Overview
In your project's Gruntfile, add a section named `{%= short_name %}` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  {%= short_name %}: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

## Options

### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

## Usage Examples

### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  {%= short_name %}: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  {%= short_name %}: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].

## Release History
_(Nothing yet)_
