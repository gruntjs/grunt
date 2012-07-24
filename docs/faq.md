[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# Frequently Asked Questions

## On Windows, why does my JS editor open when I try to run grunt?
If you're in the same directory as the [Gruntfile](getting_started.md), Windows tries to execute _that file_ when you type grunt. So you need to type `grunt.cmd` instead.

An alternative would be to use the `DOSKEY` command to create a grunt macro, following [these directions](http://devblog.point2.com/2010/05/14/setup-persistent-aliases-macros-in-windows-command-prompt-cmd-exe-using-doskey/). That would allow you to use `grunt` instead of `grunt.cmd`.

This is the `DOSKEY` command you'd use:

```
DOSKEY grunt=grunt.cmd $*
```

## Why does grunt complain that PhantomJS isn't installed?
In order for the [qunit task](task_qunit.md) to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)

## Why doesn't my asynchronous task complete?
Chances are this is happening because you have forgotten to call the [this.async](api_task.md#thisasync--grunttaskcurrentasync) method to tell grunt that your task is asynchronous. For simplicity's sake, grunt uses a synchronous coding style, which can be switched to asynchronous by calling `this.async()` within the task body.

Note that passing `false` to the `done()` function tells grunt that the task has failed.

For example:

```javascript
grunt.registerTask('asyncme', 'My asynchronous task.', function() {
  var done = this.async();
  doSomethingAsync(done);
});
```

## How can I share parameters across multiple tasks?
While each task can accept its own parameters, there are a few options available for sharing parameters across multiple tasks.

### "Dynamic" alias tasks
**This is the preferred method for sharing parameters across multiple tasks.**

Whereas [alias tasks](api.md#gruntregistertask) are necessarily simple, a regular task can use [grunt.task.run](api_task.md#grunttaskrun) to make it effectively function as a "dynamic" alias task. In this example, running `grunt build:001` on the command line would result in the `foo:001`, `bar:001` and `baz:001` tasks being run.

```javascript
grunt.registerTask('build', 'Run all my build tasks.', function(n) {
  if (n == null) {
    grunt.warn('Build num must be specified, like build:001.');
  }
  grunt.task.run('foo:' + n, 'bar:' + n, 'baz:' + n);
});
```

### -- options

Another way to share a parameter across multiple tasks would be to use [grunt.option](api.md#gruntoption). In this example, running `grunt deploy --target=staging` on the command line would cause `grunt.option('target')` to return `"staging"`.

```javascript
grunt.registerTask('upload', 'Upload code to specified target.', function(n) {
  var target = grunt.option('target');
  // do something useful with target here
});
grunt.registerTask('deploy', ['validate', 'upload']);
```

_Note that boolean options can be specified using just a key without a value. For example, running `grunt deploy --staging` on the command line would cause `grunt.option('staging')` to return `true`._

### Globals and configs

In other cases, you may want to expose a way to set configuration or global values. In those cases, register a task that sets its arguments as a global or config value.

In this example, running `grunt set_global:name:peter set_config:target:staging deploy` on the command line would cause `global.name` to be `"peter"` and `grunt.config('target')` to return `"staging"`. Presumably, the `deploy` task would use those values.

```javascript
grunt.registerTask('set_global', 'Set a global variable.', function(name, val) {
  global[name] = val;
});

grunt.registerTask('set_config', 'Set a config property.', function(name, val) {
  grunt.config.set(name, val);
});
```
