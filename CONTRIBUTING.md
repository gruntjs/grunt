[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](https://github.com/gruntjs/grunt/blob/devel/docs/toc.md)

# Contributing to grunt

There are a number of grunt-related projects:

* [grunt](https://github.com/gruntjs/grunt) - The main grunt project
* [gruntjs.com](https://github.com/gruntjs/gruntjs.com) - The gruntjs.com website
* [contrib plugins](https://github.com/gruntjs/grunt-contrib) - All the grunt "contrib" plugins

In addition, the contrib plugins are all individual repositories listed on the [gruntjs org homepage](https://github.com/gruntjs).

## Modifying grunt
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

1. Fork and clone the repo.
1. Check out the correct branch. Currently, grunt development happens in the `devel` branch.
1. Run `npm install` to install all grunt dependencies.
1. Run `npm link` to ensure that the dev version of grunt is the global version of grunt.
1. Run `grunt` to grunt grunt.

Assuming that you don't see any red, you're ready to go. Just be sure to run `grunt` after making any changes, to ensure that nothing breaks.

## Submitting pull requests

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

## Reverting back to the "official" grunt
If, for some reason, you need to revert back to the current npm grunt release, just reinstall grunt globally with ```npm install -g grunt```

## Filing issues
If something isn't working like you think it should, read the [API documentation](https://github.com/gruntjs/grunt/blob/devel/docs/api.md). If it still isn't working like you think it should, [file an issue](https://github.com/gruntjs/grunt/issues). If you'd like to chat directly, pop into IRC.

## Discussing grunt
Join the [freenode](http://freenode.net/) #grunt IRC channel. We've got a bot and everything.
