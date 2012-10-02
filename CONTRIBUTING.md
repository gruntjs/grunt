[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](https://github.com/gruntjs/grunt/blob/devel/docs/toc.md)

# Contributing to grunt

There are a number of grunt projects.

* [grunt](https://github.com/gruntjs/grunt) - the main grunt project
* [gruntjs.com](https://github.com/gruntjs/gruntjs.com) - the gruntjs.com website
* [grunt-contrib collection](https://github.com/gruntjs/grunt-contrib) - a collection of all grunt "contrib" plugins

In addition, each individual grunt-contrib plugin is a separate repository listed on the [gruntjs org homepage](https://github.com/gruntjs).

## Filing issues

If something isn't working like you think it should, please read the documentation. If it still isn't working like you think it should, file an issue. If you'd like to chat directly, pop into IRC.

**If there's an issue with a specific grunt-contrib plugin:**  
Please file an issue on that plugin's issues tracker.

**If you'd like to contribute a new plugin:**  
Please file an issue on the [grunt-contrib collection issues tracker](https://github.com/gruntjs/grunt-contrib/issues). We don't accept all plugins, but we'll certainly consider yours.

**If there's an issue with the [website](http://gruntjs.com/):**  
Please file an issue on the [gruntjs.com website issues tracker](https://github.com/gruntjs/gruntjs.com/issues).

**If there's an issue that isn't specific to any of the above:**  
Please file an issue on the [grunt issues tracker](https://github.com/gruntjs/grunt/issues).

## Discussing grunt
Join the [freenode](http://freenode.net/) #grunt IRC channel. We've got a bot and everything.

## Modifying grunt
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

1. Fork and clone the repo.
1. Check out the correct branch. Currently, grunt development happens in the `devel` branch.
1. Run `npm install` to install all grunt dependencies.
1. Run `npm link` to ensure that the dev version of grunt is in the system path.
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

* Two spaces, no tabs.
* No trailing whitespace, except in markdown files where a linebreak must be forced.
* Use single-quote delimited strings `'`, not double-quote delimited strings `"`.
* Don't go overboard with the whitespace.
* Prefer `if` and `else` to the `? :` conditional operator.
* **Follow the conventions you see used in the source already.**

### Reverting back to the "official" grunt
If you've used `npm link` to put your dev version of grunt in the system path and, for some reason, need to revert back to the current npm grunt release, just reinstall grunt globally with `npm install -g grunt`
