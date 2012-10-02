[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](https://github.com/gruntjs/grunt/blob/devel/docs/toc.md)

# Contributing to grunt

There are a number of grunt projects.

* [grunt](https://github.com/gruntjs/grunt) - the main grunt project
* [gruntjs.com](https://github.com/gruntjs/gruntjs.com) - the gruntjs.com website
* [grunt-contrib collection](https://github.com/gruntjs/grunt-contrib) - a collection of all grunt "contrib" plugins

In addition, each individual grunt-contrib plugin is a separate repository listed on the [gruntjs org homepage](https://github.com/gruntjs).

## Filing issues
If something isn't working like you think it should, please read the documentation first. If you'd like to chat with someone, [pop into IRC](#discussing-grunt) and ask your question there.

The best way to ensure an issue gets addressed is to file it in the appropriate issues tracker.

**If there's an issue with a specific grunt-contrib plugin:**  
Please file an issue on that plugin's issues tracker.

**If you'd like to contribute a new plugin:**  
Please file an issue on the [grunt-contrib collection issues tracker](https://github.com/gruntjs/grunt-contrib/issues). We don't accept all plugins, but we'll certainly consider yours.

**If there's an issue with the [website](http://gruntjs.com/):**  
Please file an issue on the [gruntjs.com website issues tracker](https://github.com/gruntjs/gruntjs.com/issues).

**If there's an issue that isn't specific to any of the above:**  
Please file an issue on the [grunt issues tracker](https://github.com/gruntjs/grunt/issues).

### Simplify the issue
Try to [reduce your code](http://www.webkit.org/quality/reduction.html) to the bare minimum required to reproduce the issue. This makes it much easier (and much faster) to isolate and fix the issue.

### Explain the issue
If we can't reproduce the issue, we can't fix it. Please list the exact steps required to reproduce the issue. Include versions of your OS, Node.js, grunt, etc. Include relevant logs or sample code.

## Discussing grunt
Join the [freenode](http://freenode.net/) IRC #grunt channel. We've got a bot and everything.

_No private messages, please._

## Modifying grunt
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

1. Fork and clone the repo.
1. Check out the correct branch. Currently, grunt development happens in the `devel` branch.
1. Run `npm install` to install all grunt dependencies.
1. Run `npm link` to put the dev version of grunt in the system path (this is only needed for developing grunt, not for plugins or the website).
1. Run `grunt` to grunt grunt.

Assuming that you don't see any red, you're ready to go. Just be sure to run `grunt` after making any changes, to ensure that nothing breaks.

### Submitting pull requests

1. Create a new branch, please don't work in your `master` or `devel` branch directly.
1. Add failing tests for the change you want to make. Run `grunt` to see the tests fail.
1. Fix stuff.
1. Run `grunt` to see if the tests pass. Repeat steps 2-4 until done.
1. Update the documentation to reflect any changes.
1. Push to your fork and submit a pull request.

### Syntax

* Two space indents. Don't use tabs anywhere. Use `\t` if you need a tab character in a string.
* No trailing whitespace, except in markdown files where a linebreak must be forced.
* Don't go overboard with the whitespace.
* No more than [one assignment](http://benalman.com/news/2012/05/multiple-var-statements-javascript/) per `var` statement.
* Delimit strings with single-quotes `'`, not double-quotes `"`.
* Prefer `if` and `else` to ["clever"](http://programmers.stackexchange.com/a/25281) uses of `? :` conditional or `||`, `&&` logical operators.
* Comments are great. Just put them _before_ the line of code, _not_ at the _end_ of the line.
* **When in doubt, follow the conventions you see used in the source already.**

### Reverting back to the "official" grunt
If you've used `npm link` to put a dev version of grunt in the system path and, for some reason, need to revert back to the current official grunt release, just reinstall grunt globally with `npm install -g grunt`
