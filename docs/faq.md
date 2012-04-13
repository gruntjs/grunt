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

## Why doesn't my asynchronous task work?! <a name="why-doesnt-my-async-task-work" href="#why-doesnt-my-async-task-work"" title="Link to this section">⚑</a>

Chances are it's because you have forgotten to use the tell the current task that you are using [async](https://github.com/cowboy/grunt/blob/master/docs/api_task.md#this-async-grunt-task-current-async) behaviour.

For simplicity of use and a clean, readable code Grunt uses a synchronous coding style.  If you are creating a task that does integrate with an asynchronous module or you prefer to write in an asynchronous style be sure to call `this.async()` within the task body and grunt will provide you with a callback function to use, e.g.:

```js
grunt.registerTask('asyncme', 'Your task description goes here.', function() {
  var callback = this.async();

  doSomethingAsync(callback);
});
```
