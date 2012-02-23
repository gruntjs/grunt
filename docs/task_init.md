[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# init (built-in task)
Initialize a new project. Looks at the enviroment, asks you a few questions, then generates a [grunt.js configuration](configuraring.md)
and some other files, depending on the template you choose

## About

Unlike other taks, init should be run only once for a project. For existing projects, make sure that everything is already commited, as
it may override existing files, like a README.md or package.json.

init currently supports three templates:

* commonjs
* jquery
* node

## Usage examples

Create a new jQuery plugin project:

`grunt init:jquery`

Create a new node.js project:

`grunt init:node`

See the [init task source](https://github.com/cowboy/grunt/blob/master/tasks/init.js) for more information.
