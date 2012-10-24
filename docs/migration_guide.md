[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# THIS DOCUMENT IS INCOMPLETE AND OUTDATED

# 0.4.0 Migration Guide
This list outlines the changes and improvements made for 0.4.0.

## grunt

* `grunt.utils` was renamed to [grunt.util](api_util.md).
* The `grunt.js` config file was renamed to `Gruntfile.js`.
* ES5 Strict Mode is enabled throughout Grunt.
* CoffeeScript is supported.
* [grunt.package](api.md#gruntpackage) was added containing the contents of Grunt's `package.json`.
* [grunt.version](api.md#gruntversion) added holding the current version of Grunt.
* `--version` option added to display Grunt's version.
* The `meta.banner` config option is now just `banner`.

## grunt.completion

* [grunt.completion](faq.md#how-do-i-enable-shell-tab-auto-completion) library was added for bash auto-completion.

## grunt.event

* [grunt.event](api_event.md) library added.

## grunt.fail

* Won't emit a beep if `--no-color` option specified.

## grunt.file

* [grunt.file.expand](api_file.md#gruntfileexpand), [match](api_file.md#gruntfilematch), [isMatch](api_file.md#gruntfileismatch) is able to exclude files by prefixing `!` and pattern order is significant.
* [grunt.file.exists](api_file.md#gruntfileexists) added to return a boolean if the given path exists.
* [grunt.file.isLink](api_file.md#gruntfileislink) added to return a boolean if the given path is a symbolic link.
* [grunt.file.isDir](api_file.md#gruntfileisdir) added to return a boolean if the given path is a directory.
* [grunt.file.isFile](api_file.md#gruntfileisfile) added to return a boolean if the given path is a file.
* [match](api_file.md#gruntfilematch) added to match wildcard patterns against one or more file paths then return an uniqued array of all files matched.
* [grunt.file.readYAML](api_file.md#gruntfilereadyaml) added to parse YAML files using `js-yaml`.
* `mode` argument added to [file.mkdir](api_file.md#gruntfilemkdir) and now defaults to the systems umask.
* [grunt.file.read](api_file.md#gruntfileread) strips BOMs which was causing issues with JSHint.
* [grunt.file.delete](api_file.md#gruntfiledelete) added for recursively removing files and folders.

## grunt.task

* [task.run](api_task.md#grunttaskrun), [task.registerTask](api_task.md#grunttaskregistertask-%E2%98%83) no longer supports a space-separated list of of tasks.
* Task names and arguments may now contain spaces.
* `grunt.task.current.files` or `this.files` in a task, contains a normalized list of files.
* `grunt.task.current.file` or `this.file` has been removed. Use `this.files` instead.
* [grunt.task.current.options or this.options](api_task.md#thisoptions--grunttaskcurrentoptions) in a task, returns a task specific options object.
* `grunt.task.splitArgs` added to split colon separated params but not escaped `\\:` colons.
* [grunt.task.unregisterTasks](api_task.md#grunttaskunregistertasks-%E2%98%83) and [grunt.task.unregisterHelpers](api_task.md#grunttaskunregisterhelpers-%E2%98%83) added to unregister one or more tasks or helpers.

## grunt.template

* [grunt.template.addDelimiters](api_template.md#grunttemplateadddelimiters), [grunt.template.setDelimiters](api_template.md#grunttemplatesetdelimiters) added to set or add to underscore.js template delimiters.

## init task

* License use abbreviations from [opensource.org](http://www.opensource.org/licenses/alphabetical).
* The init templates have been updated to reflect the v0.4 changes.

## lint task

* The `lint` task was renamed to `jshint`.
* The `jshint` config is deprecated. `options` and `globals` are now located in the `jshint.options` config.
* Lint will look for and read `.jshintrc` files.
* JSHint upgraded to 0.9 which supports the `unused` var option.

## min task

* The `min` task was renamed to `uglify`.
* The `uglify` config is deprecated and now located in the `uglify.options` config.

## qunit task

* The qunit task will fail on versions of PhantomJS pre-1.4.0.

## server task

* Now supports a `--keepalive` option and flag.

## test task

* The `test` task was renamed to `nodeunit`.

## helpers

* Helpers and directives have all been removed on [ebb6674](https://github.com/cowboy/grunt/commit/ebb6674b498ccd42f9bd4c6bf539b0b163498217).
