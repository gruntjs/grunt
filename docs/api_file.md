[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.file

Glob expansion, file reading, writing, directory traversing.

See the [file lib source](../lib/grunt/file.js) for more information.

file.mkdir
file.recurse
file.findup

file.write
file.read
file.readJSON
file.copy

file.isPathAbsolute

file.npmTaskDir
file.userDir

file.taskDirs
file.taskFiles
file.taskFile
file.taskFileDefaults

file.clearRequireCache


## The file API

### grunt.file.expand
Return a unique array of all file or directory paths that match the given wildcard pattern(s). This method accepts one or more comma separated wildcard patterns as well as an array of wildcard patterns.

Patterns are resolved relative to the [grunt.js gruntfile](configuring.md). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on wildcard patterns.

```javascript
grunt.file.expand(patterns)
```

### grunt.file.expandDirs
Return a unique array of all directory paths that match the given wildcard pattern(s). This method accepts one or more comma separated wildcard patterns as well as an array of wildcard patterns.

Patterns are resolved relative to the [grunt.js gruntfile](configuring.md). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on wildcard patterns.

```javascript
grunt.file.expandDirs(patterns)
```

### grunt.file.expandFiles
Return a unique array of all file paths that match the given wildcard pattern(s). This method accepts one or more comma separated wildcard patterns as well as an array of wildcard patterns.

Patterns are resolved relative to the [grunt.js gruntfile](configuring.md). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on wildcard patterns.

```javascript
grunt.file.expandFiles(patterns)
```

### grunt.file.expandFileURLs
Return a unique array of all `file://` URLs for files that match the given wildcard pattern(s). Any absolute `file://`, `http://` or `https://` URLs specified will be passed through. This method accepts one or more comma separated wildcard patterns (or URLs), as well as an array of wildcard patterns (or URLs).

Patterns are resolved relative to the [grunt.js gruntfile](configuring.md). See the [minimatch](https://github.com/isaacs/minimatch) module documentation for more details on wildcard patterns.

```javascript
grunt.file.expandFileURLs(patternsOrURLs)
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
