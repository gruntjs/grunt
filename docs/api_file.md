[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.file

Wildcard expansion, file reading, writing, directory traversing.

See the [file lib source](../lib/grunt/file.js) for more information.

## The file API <a name="the-file-api" href="#the-file-api" title="Link to this section">⚑</a>
There are many provided methods for reading and writing files, as well as traversing the filesystem and finding files by wildcard patterns. Many of these methods are wrappers around core Node.js file functionality, but with additional error handling and logging.

_Note: all file paths are relative to the [grunt.js gruntfile](getting_started.md) unless the current working directory is changed with `grunt.file.setBase` or the `--base` command-line option._

### grunt.file.read <a name="grunt-file-read" href="#grunt-file-read" title="Link to this section">⚑</a>
Read and return a file's contents. The `encoding` argument defaults to `utf8` if unspecified.

```javascript
grunt.file.read(filepath, encoding)
```

### grunt.file.readJSON <a name="grunt-file-readjson" href="#grunt-file-readjson" title="Link to this section">⚑</a>
Read a file's contents, parsing the data as JSON and returning the result.

```javascript
grunt.file.readJSON(filepath)
```

### grunt.file.write <a name="grunt-file-write" href="#grunt-file-write" title="Link to this section">⚑</a>
Write the specified contents to a file, creating intermediate directories if necessary.

_If the `--no-write` command-line option is specified, the file won't actually be written._

```javascript
grunt.file.write(filepath, contents)
```

### grunt.file.copy <a name="grunt-file-copy" href="#grunt-file-copy" title="Link to this section">⚑</a>
Copy a source file to a destination path, creating intermediate directories if necessary.

_If the `--no-write` command-line option is specified, the file won't actually be written._

```javascript
grunt.file.copy(srcpath, destpath [, options])
```

The `options` object has these possible properties:

```javascript
var options = {
  // If specified, the file contents will be parsed as `utf8` and passed into
  // the function, whose return value will be used as the destination file's
  // contents. If this function returns false, the file copy will be aborted.
  process: processFunction,
  // These optional wildcard patterns will be matched against the filepath using
  // grunt.file.isMatch. If a specified wildcard pattern matches, the file will
  // not be processed via `processFunction`. Note that `true` may also be
  // specified to prvent processing.
  noProcess: wildcardPatterns
};
```

### grunt.file.mkdir <a name="grunt-file-mkdir" href="#grunt-file-mkdir" title="Link to this section">⚑</a>
Works like `mkdir -p`. Create a directory along with any intermediate directories.

_If the `--no-write` command-line option is specified, directories won't actually be created._

```javascript
grunt.file.mkdir(dirpath)
```

### grunt.file.recurse <a name="grunt-file-recurse" href="#grunt-file-recurse" title="Link to this section">⚑</a>
Recurse into a directory, executing `callback` for each file.

```javascript
grunt.file.recurse(rootdir, callback)
```

The callback function receives the following arguments:

```javascript
function callback(abspath, rootdir, subdir, filename) {
  // The full path to the current file, which is nothing more than
  // the rootdir + subdir + filename arguments, joined.
  abspath
  // The root director, as originally specified.
  rootdir
  // The current file's directory, relative to rootdir.
  subdir
  // The filename of the current file, without any directory parts.
  filename
}
```

### grunt.file.findup <a name="grunt-file-findup" href="#grunt-file-findup" title="Link to this section">⚑</a>
Search for a filename in the given directory followed by all parent directories. Returns the first matching filepath found, otherwise returns `null`.

```javascript
grunt.file.findup(rootdir, filename)
```

### grunt.file.isPathAbsolute <a name="grunt-file-ispathabsolute" href="#grunt-file-ispathabsolute" title="Link to this section">⚑</a>
Is a given file path absolute? Returns a boolean.

Like the Node.js [path.join](http://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) method, this method will join all arguments together and normalize the resulting path.

```javascript
grunt.file.isPathAbsolute(path1 [, path2 [, ...]])
```

### grunt.file.userDir <a name="grunt-file-userdir" href="#grunt-file-userdir" title="Link to this section">⚑</a>
Return a file path relative to the user's `.grunt` directory, which is `%USERPROFILE%\.grunt\` on Windows, and `~/.grunt/` on OS X or Linux. If no file path is specified, the base user `.grunt` directory path will be returned. If the specified path is not found, `null` is returned.

Windows users: `%USERPROFILE%` is generally your `Documents and Settings` directory.

_Like the Node.js [path.join](http://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) method, this method will join all arguments together and normalize the resulting path._

```javascript
grunt.file.userDir([path1, [, path2 [, ...]]])
```

### grunt.file.setBase <a name="grunt-file-setbase" href="#grunt-file-setbase" title="Link to this section">⚑</a>
Change grunt's current working directory. By default, all file paths are relative to the [grunt.js gruntfile](getting_started.md). This works just like the `--base` command-line option.

```javascript
grunt.file.setBase(path1 [, path2 [, ...]])
```

Like the Node.js [path.join](http://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) method, this method will join all arguments together and normalize the resulting path.


## File Lists and Wildcards <a name="file-lists-and-wildcards" href="#file-lists-and-wildcards" title="Link to this section">⚑</a>
Wildcard patterns are resolved using the [glob-whatev library](https://github.com/cowboy/node-glob-whatev). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on supported wildcard patterns.

There are also a number of [task-specific file listing methods](api_task.md) that find files inside grunt plugins and task directories.

_Note: all file paths are relative to the [grunt.js gruntfile](getting_started.md) unless the current working directory is changed with `grunt.file.setBase` or the `--base` command-line option._

### grunt.file.expand <a name="grunt-file-expand" href="#grunt-file-expand" title="Link to this section">⚑</a>
Return a unique array of all file or directory paths that match the given wildcard pattern(s). This method accepts one or more comma separated wildcard patterns as well as an array of wildcard patterns.

The `options` object supports all [minimatch](https://github.com/isaacs/minimatch) options.

```javascript
grunt.file.expand([options, ] patterns)
```

### grunt.file.expandDirs <a name="grunt-file-expanddirs" href="#grunt-file-expanddirs" title="Link to this section">⚑</a>
This method behaves the same as `grunt.file.expand` except it only returns directory paths.

```javascript
grunt.file.expandDirs([options, ] patterns)
```

### grunt.file.expandFiles <a name="grunt-file-expandfiles" href="#grunt-file-expandfiles" title="Link to this section">⚑</a>
This method behaves the same as `grunt.file.expand` except it only returns file paths.

```javascript
grunt.file.expandFiles([options, ] patterns)
```

This method is used by many built-in tasks to handle wildcard expansion of the specified source files. See the [concat task source](../tasks/concat.js) for an example.

### grunt.file.expandFileURLs <a name="grunt-file-expandfileurls" href="#grunt-file-expandfileurls" title="Link to this section">⚑</a>
Return a unique array of all `file://` URLs for files that match the given wildcard pattern(s). Any absolute `file://`, `http://` or `https://` URLs specified will be passed through. This method accepts one or more comma separated wildcard patterns (or URLs), as well as an array of wildcard patterns (or URLs).

```javascript
grunt.file.expandFileURLs(patternsOrURLs)
```

See the [qunit task source](../tasks/qunit.js) for an example.

### grunt.file.isMatch <a name="grunt-file-ismatch" href="#grunt-file-ismatch" title="Link to this section">⚑</a>
Match one or more wildcard patterns against a file path. If any of the specified matches, return `true` otherwise return `false`. This method accepts a single string wildcard pattern as well as an array of wildcard patterns. Note that `true` may also be specified to prvent processing.

```javascript
grunt.file.isMatch(patterns, filepath)
```

Patterns without slashes will be matched against the basename of the path if it contains slashes, eg. pattern `*.js` will match filepath `path/to/file.js`.

## External libraries <a name="external-libraries" href="#external-libraries" title="Link to this section">⚑</a>

### grunt.file.glob <a name="grunt-file-glob" href="#grunt-file-glob" title="Link to this section">⚑</a>
[glob-whatev](https://github.com/cowboy/node-glob-whatev) - Synchronous file globbing utility.
