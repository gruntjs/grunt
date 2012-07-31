[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.event

Event emitting via the [EventEmitter2][ee2] library.

[ee2]: https://github.com/hij1nx/EventEmitter2

See the [event lib source](../lib/grunt/event.js) and [EventEmitter2 docs][ee2] for more information.

## The event API
Even though only the most relevant methods are listed on this page, the full [EventEmitter2 API][ee2] is available on the `grunt.event` object. Event namespaces may be specified with the `.` (dot) separator, and namespace wildcards have been enabled.

### grunt.event.on
Adds a listener to the end of the listeners array for the specified event.

```javascript
grunt.event.on(event, listener)
```

### grunt.event.once
Adds a **one time** listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.

```javascript
grunt.event.once(event, listener)
```

### grunt.event.many
Adds a listener that will execute **n times** for the event before being removed. The listener is invoked only the first time the event is fired, after which it is removed.

```javascript
grunt.event.many(event, timesToListen, listener)
```

### grunt.event.off
Remove a listener from the listener array for the specified event.

```javascript
grunt.event.off(event, listener)
```

### grunt.event.removeAllListeners
Removes all listeners, or those of the specified event.

```javascript
grunt.emitter.removeAllListeners([event])
```

### grunt.event.emit
Execute each of the listeners that may be listening for the specified event name in order with the list of arguments.

```javascript
grunt.event.emit(event, [arg1], [arg2], [...])
```
