[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# init (built-in task)
Generate project scaffolding from a predefined template.

## About

The `init` task initializes a new project, based on the current environment and the answers to a few questions. Once complete, a [grunt.js configuration file](configuring.md) will be generated along with a complete directory structure, including a basic readme, license, package.json, sample source files and unit tests (etc).

The exact files and contents created depend on the template chosen along with the answers to the questions asked.

Unlike other tasks, init should only ever be run once for a project. Typically, it is run at the very beginning before work has begun, but it can be run later. **Just keep in mind that new files are generated, so for existing projects, ensure that everything is already committed first.**

## Usage examples

Change to a new directory, and type in `grunt init:TEMPLATE` where TEMPLATE is one of the following templates. Answer the questions. Done.

## Built-in templates

This task currently supports these templates:

* `commonjs` - [sample repo](https://github.com/cowboy/grunt-commonjs-example/tree/HEAD~1) and [sample creation transcript](https://github.com/cowboy/grunt-commonjs-example)
* `jquery` - [sample repo](https://github.com/cowboy/grunt-jquery-example/tree/HEAD~1) and [sample creation transcript](https://github.com/cowboy/grunt-jquery-example)
* `node` - [sample repo](https://github.com/cowboy/grunt-node-example/tree/HEAD~1) and [sample creation transcript](https://github.com/cowboy/grunt-node-example)

For each, you can view a sample repository as well as a transcript of the commands used to generate that sample repository. Take a look!

## Template structure

_TODO: write this_

See the [init task source](../tasks/init.js) for more information.
