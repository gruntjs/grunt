[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.file

Wildcard expansion, file reading, writing, directory traversing.

See the [file lib source](../lib/grunt/file.js) for more information.

## The file API
Grunt provides many methods for reading and writing files, as well as traversing the filesystem and resolving wildcards.

### grunt.file.read
DESCRIPTION

```javascript
grunt.file.read()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.readJSON
DESCRIPTION

```javascript
grunt.file.readJSON()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.write
DESCRIPTION

```javascript
grunt.file.write()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.copy
DESCRIPTION

```javascript
grunt.file.copy()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.mkdir
DESCRIPTION

```javascript
grunt.file.mkdir()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.recurse
DESCRIPTION

```javascript
grunt.file.recurse()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.findup
DESCRIPTION

```javascript
grunt.file.findup()
```

In this example, DESCRIPTION

```javascript
```

### grunt.file.isPathAbsolute
DESCRIPTION

```javascript
grunt.file.isPathAbsolute()
```

In this example, DESCRIPTION

```javascript
```

## File Lists and Wildcards

### grunt.file.expand
Return a unique array of all file or directory paths that match the given wildcard pattern(s). This method accepts one or more comma separated wildcard patterns as well as an array of wildcard patterns.

Patterns are resolved relative to the [grunt.js gruntfile](configuring.md). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on wildcard patterns.

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

### grunt.file.expandFileURLs
Return a unique array of all `file://` URLs for files that match the given wildcard pattern(s). Any absolute `file://`, `http://` or `https://` URLs specified will be passed through. This method accepts one or more comma separated wildcard patterns (or URLs), as well as an array of wildcard patterns (or URLs).

Patterns are resolved relative to the [grunt.js gruntfile](configuring.md). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on wildcard patterns.

```javascript
grunt.file.expandFileURLs(patternsOrURLs)
```

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
