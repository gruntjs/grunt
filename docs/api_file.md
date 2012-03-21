[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.file

Wildcard expansion, file reading, writing, directory traversing.

See the [file lib source](../lib/grunt/file.js) for more information.

## The file API
Grunt provides many methods for reading and writing files, as well as traversing the filesystem and resolving wildcards. Many of these methods are wrappers around core Node.js file functionality, but with additional error handling and logging.

_Note: all file paths are relative to the [grunt.js gruntfile](configuring.md)._

### grunt.file.read
Read and return a file's contents. If `encoding` isn't specified, defaults to `utf8`.

```javascript
grunt.file.read(filepath, encoding)
```

### grunt.file.readJSON
Read a file's contents, parsing them as JSON and returning the result.

```javascript
grunt.file.readJSON(filepath)
```

### grunt.file.write
Write the specified contents to a file, creating intermediate directories if necessary. If the `--no-write` command-line option is specified, the file won't actually be written.

```javascript
grunt.file.write(filepath, contents)
```

### grunt.file.copy
Copy a source file to a destination path, creating intermediate directories if necessary. If `callback` is specified, the file contents will be parsed as `utf8` and passed into that function, whose return value will be used as the destination file's contents. If the `--no-write` command-line option is specified, the file won't actually be written.

```javascript
grunt.file.copy(srcpath, destpath [, callback])
```

### grunt.file.mkdir
Works like `mkdir -p`. Create a directory along with any intermediate directories. If the `--no-write` command-line option is specified, directories won't actually be created.

```javascript
grunt.file.mkdir(dirpath)
```

### grunt.file.recurse
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

### grunt.file.findup
Search for a filename in the given directory followed by all parent directories. Returns the first matching filepath found, otherwise returns `null`.

```javascript
grunt.file.findup(rootdir, filename)
```

### grunt.file.isPathAbsolute
Is a given file path absolute? Returns a boolean.

Like the Node.js [path.join](http://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) method, this method will join all arguments together and normalize the resulting path.

```javascript
grunt.file.isPathAbsolute(path1 [, path2 [, ...]])
```

## File Lists and Wildcards
Wildcard patterns are resolved using the [glob-whatev library](https://github.com/cowboy/node-glob-whatev). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on supported wildcard patterns.

_Note: all file paths and wildcard patterns are relative to the [grunt.js gruntfile](configuring.md)._

### grunt.file.expand
Return a unique array of all file or directory paths that match the given wildcard pattern(s). This method accepts one or more comma separated wildcard patterns as well as an array of wildcard patterns.

```javascript
grunt.file.expand(patterns)
```

### grunt.file.expandDirs
This method behaves the same as `grunt.file.expand` except it only returns directory paths.

```javascript
grunt.file.expandDirs(patterns)
```

### grunt.file.expandFiles
This method behaves the same as `grunt.file.expand` except it only returns file paths.

```javascript
grunt.file.expandFiles(patterns)
```

This method is used by many built-in tasks to handle wildcard expansion of the specified source files. See the [concat task source](../tasks/concat.js) for an example.

### grunt.file.expandFileURLs
Return a unique array of all `file://` URLs for files that match the given wildcard pattern(s). Any absolute `file://`, `http://` or `https://` URLs specified will be passed through. This method accepts one or more comma separated wildcard patterns (or URLs), as well as an array of wildcard patterns (or URLs).

```javascript
grunt.file.expandFileURLs(patternsOrURLs)
```

See the [qunit task source](../tasks/qunit.js) for an example.

## Task Directories and Files
For a given `.js` tasks file or related "extra" file, these paths will be searched in order, as applicable, until the first matching file is found. This allows a user to override task-related files in any number of ways.

1. The grunt user tasks directory, `%USERPROFILE%\.grunt\tasks\` on Windows, `~/.grunt/tasks/` on OS X or Linux.
2. Npm-installed grunt plugins or tasks directories specified on the command-line via `--tasks`.
3. Task directories built-in to a Npm-installed grunt plugin run via its `grunt-` named binary.
4. Npm-installed grunt plugins or tasks directories specified in the [grunt.js gruntfile](configuring.md).
5. The built-in grunt tasks directory.


### grunt.file.taskDirs
Search tasks directories in the above order for a given subdirectory, returning an array of all matching paths in preferred search order. If no path is specified, the base tasks directories will be returned.

Like the Node.js [path.join](http://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) method, this method will join all arguments together and normalize the resulting path.

```javascript
grunt.file.taskDirs([path1, [, path2 [, ...]]])
```

### grunt.file.taskFiles
Search tasks directories in the above order for a given file, returning an array of all matching paths in preferred search order.

Like the Node.js [path.join](http://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) method, this method will join all arguments together and normalize the resulting path.

```javascript
grunt.file.taskFiles(path1, [, path2 [, ...]])
```

### grunt.file.taskFile
Search tasks directories in the above order for a given file, returning the first matching file.

Like the Node.js [path.join](http://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) method, this method will join all arguments together and normalize the resulting path.

```javascript
grunt.file.taskFile(path1, [, path2 [, ...]])
```

### grunt.file.taskFileDefaults
Search tasks directories in the above order for a JSON data file, returning the merged data object, allowing default data to be progressively overridden.

Like the Node.js [path.join](http://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) method, this method will join all arguments together and normalize the resulting path.

```javascript
grunt.file.taskFileDefaults(path1, [, path2 [, ...]])
```





file.npmTaskDir
file.userDir


file.clearRequireCache


### grunt.file.XXX
DESCRIPTION

```javascript
grunt.file.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.XXX
DESCRIPTION

```javascript
grunt.file.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.XXX
DESCRIPTION

```javascript
grunt.file.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.XXX
DESCRIPTION

```javascript
grunt.file.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.XXX
DESCRIPTION

```javascript
grunt.file.XXX()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.XXX
DESCRIPTION

```javascript
grunt.file.XXX()
```

In this example, DESCRIPTION

```javascript
```
