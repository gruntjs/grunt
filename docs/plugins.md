[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# Plugins

This section is a work in progress. Grunt currently has preliminary plugin support, but it might be a little while before plugins work perfectly. If you have any suggestions or comments, please [file an issue](/cowboy/grunt/issues) and we'll work it all out!

## Notes for now:

### Plugin creation and development

1. Run `grunt init:gruntplugin` in an empty directory.
2. Run `npm install` to install grunt locally.
3. Run `./node_modules/.bin/grunt` to run the plugin-specific grunt. Just `grunt` won't work.
4. When done, run `npm publish` to publish the grunt plugin to npm!

### Two usage options

Global install, where you run `grunt-yourplugin`

1. Run `npm install -g grunt-yourplugin`. This installs the plugin, which contains its own internal grunt (the version specified in the plugin's package.json).
2. A new `grunt-yourplugin` binary should be globally available.
3. When run from that binary, the internal grunt runs, with access to all of that plugin's tasks and helpers, for all projects.

Local install, where you run `grunt`

1. Grunt should already have been installed globally with `npm install -g grunt`.
2. In your project's root, next to the grunt.js gruntfile, run `npm install grunt-yourplugin`.
3. Add `grunt.loadNpmTasks('grunt-yourplugin')` into the project's grunt.js gruntfile.
2. Run `grunt` and all of the `grunt-yourplugin` tasks and helpers should be available.

## Issues

* It seems like nothing I do allows `grunt.loadNpmTasks('grunt-yourplugin')` to work unless the plugin is installed locally.
* Is it possible to load the plugin globally? Is it even important?
* What's the best way to do all this stuff, anyways?
