[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.file

Wildcard expansion, file reading, writing, directory traversing.

See the [file lib source](../lib/grunt/file.js) for more information.

## The file API
Grunt provides many methods for reading and writing files, as well as traversing the filesystem and resolving wildcards. Many of these methods are wrappers around core Node.js file functionality with built-in error handling and logging.

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
Write the specified contents to a file, creating interim directories if necessary. If the `--no-write` command-line option is specified, the file won't actually be written.

```javascript
grunt.file.write(filepath, contents)
```

### grunt.file.copy
Copy a source file to a destination path, creating interim directories if necessary. If `callback` is specified, the file contents will be parsed as `utf8` and passed into that function, whose result will be used instead. If the `--no-write` command-line option is specified, the file won't actually be written.

```javascript
grunt.file.copy(srcpath, destpath [, callback])
```

### grunt.file.mkdir
Works like `mkdir -p`. Create a directory and any intermediary directories.

```javascript
grunt.file.mkdir(dirpath)
```

### grunt.file.recurse
Recurse into a directory, executing callback for each file.

```javascript
grunt.file.recurse(rootdir, callback)
```

### grunt.file.findup
Search for a filename in the given directory or all parent directories.

```javascript
grunt.file.findup(rootdir, filename)
```

### grunt.file.isPathAbsolute
Is a given file path absolute? Note that `pathParts` can be........

```javascript
grunt.file.isPathAbsolute(pathParts)
```

## File Lists and Wildcards
Wildcard patterns are resolved relative to the [grunt.js gruntfile](configuring.md) using the [glob-whatev library](https://github.com/cowboy/node-glob-whatev). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on supported wildcard patterns.

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

This method is used by many built-in tasks to handle wildcard expansion of its source files. See the [concat task source](../tasks/concat.js) for an example.

### grunt.file.expandFileURLs
Return a unique array of all `file://` URLs for files that match the given wildcard pattern(s). Any absolute `file://`, `http://` or `https://` URLs specified will be passed through. This method accepts one or more comma separated wildcard patterns (or URLs), as well as an array of wildcard patterns (or URLs).

```javascript
grunt.file.expandFileURLs(patternsOrURLs)
```

See the [qunit task source](../tasks/qunit.js) for an example.

## Something Something

file.npmTaskDir
file.userDir

file.taskDirs
file.taskFiles
file.taskFile
file.taskFileDefaults

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
