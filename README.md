# grunt
Grunt is a task-based command line build tool for JavaScript projects.

_Grunt is currently in beta. While I'm already using it on multiple projects, it might have a minor issue or two. And things might change before its final release, based on your feedback. Please try it out in a project, and [make suggestions][issues] or [report bugs][issues]!_

## Tasks
As of now, grunt has the following predefined tasks. For detailed usage information, see [the documentation][docs].

 * **concat** - Concatenate files.
 * **init** - Generate project scaffolding from a predefined template.
 * **lint** - Validate files with [JSHint][jshint].
 * **min** - Minify files with [UglifyJS][uglify].
 * **qunit** - Run [QUnit][qunit] unit tests in a headless [PhantomJS][phantom] instance.
 * **server** - Start a static web server.
 * **test** - Run unit tests with [nodeunit][nodeunit].
 * **watch** - Run predefined tasks whenever watched files change.

_(My TODO list includes more "project scaffolding" templates, among other things)_

And in addition to the predefined tasks, you can define your own.

## Documentation
Take a look at [the documentation][docs] for all the things.

## Why does grunt exist?
Doing all this stuff manually is a total pain, and building all this stuff into a gigantic Makefile / Jakefile / Cakefile / Rakefile / ?akefile that's maintained across all my projects was also becoming a total pain. Since I always found myself performing the same tasks over and over again, for every project, it made sense to build a task-based build tool.

Being primarily a JavaScript developer, I decided to use [Node.js][node] and [npm][npm] because the dependencies I most care about ([JSHint][jshint] and [UglifyJS][uglify]) were already npm modules. That being said, while Node.js was designed to support highly-concurrent asynchronous-IO-driven web servers, it was clearly NOT designed to make command-line build tools. But none of that matters, because grunt works. Just install it and see.

## Installing grunt

Grunt is available as an [npm][npm] module. If you install grunt globally via `npm install -g grunt`, it will be available for use in all of your projects.

Once grunt has been installed, you can type `grunt --help` at the command line for more information. And if you want to see grunt "grunt" itself, cd into grunt's directory and type `grunt`

_Note: in Windows, you may need to run grunt as `grunt.cmd`._

## Release History
_(Until v1.0.0, this will only be updated when major or breaking changes are made)_

* 2012/02/03 - v0.2.14 - Added a server task (which starts a static webserver for your tasks). The qunit task now uses PhantomJS instead of Zombie.js (4768 of 4971 jQuery unit test pass, neat), and supports both file wildcards as well as http:// or https:// urls. (static webserver, anyone?). Grunt should no longer "hang" when done.
* 2012/01/29 - v0.2.5 - Added a "qunit" task as well as an init "jquery" template (as of now, there are also "node" and "commonjs" init templates).
* 2012/01/22 - v0.2.1 - Removed handlebars, templates are universally handled by underscore now. Changed init task template tags from <% %> to {% %}. Banners beginning with /*! will no longer be stripped.
* 2012/01/22 - v0.2.0 - Added "init" task with a sample template, reworked a lot of code. Hopefully it's backwards-compatible.
* 2012/01/11 - v0.1.0 - Initial release.

## License
Copyright (c) 2012 "Cowboy" Ben Alman  
Licensed under the MIT license.  
<http://benalman.com/about/license/>


[docs]: https://github.com/cowboy/grunt/blob/master/docs/toc.md
[issues]: https://github.com/cowboy/grunt/issues

[node]: http://nodejs.org/
[npm]: http://npmjs.org/
[jshint]: http://www.jshint.com/
[uglify]: https://github.com/mishoo/UglifyJS/
[nodeunit]: https://github.com/caolan/nodeunit
[qunit]: http://docs.jquery.com/QUnit
[phantom]: http://www.phantomjs.org/
