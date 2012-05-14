[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# Frequently Asked Questions

## On Windows, why does my JS editor open when I try to run grunt? <a name="on-windows-why-does-my-js-editor-open-when-i-try-to-run-grunt" href="#on-windows-why-does-my-js-editor-open-when-i-try-to-run-grunt" title="Link to this section">⚑</a>
If you're in the same directory as the [grunt.js gruntfile](getting_started.md), Windows tries to execute _that file_ when you type grunt. So you need to type `grunt.cmd` instead.

An alternative would be to use the `DOSKEY` command to create a grunt macro, following [these directions](http://devblog.point2.com/2010/05/14/setup-persistent-aliases-macros-in-windows-command-prompt-cmd-exe-using-doskey/). That would allow you to use `grunt` instead of `grunt.cmd`.

This is the `DOSKEY` command you'd use:

```
DOSKEY grunt=grunt.cmd $*
```

## Why does grunt complain that PhantomJS isn't installed? <a name="why-does-grunt-complain-that-phantomjs-isnt-installed" href="#why-does-grunt-complain-that-phantomjs-isnt-installed" title="Link to this section">⚑</a>
In order for the [qunit task](task_qunit.md) to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)

## Why doesn't my asynchronous task complete? <a name="why-doesnt-my-asynchronous-task-complete" href="#why-doesnt-my-asynchronous-task-complete" title="Link to this section">⚑</a>
Chances are this is happening because you have forgotten to call the [this.async](api_task.md#this-async-grunt-task-current-async) method to tell grunt that your task is asynchronous. For simplicity's sake, grunt uses a synchronous coding style, which can be switched to asynchronous by calling `this.async()` within the task body.

Note that passing `false` to the `done()` function tells grunt that the task has failed.

For example:

```javascript
grunt.registerTask('asyncme', 'My asynchronous task.', function() {
  var done = this.async();
  doSomethingAsync(done);
});
```
