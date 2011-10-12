(function(exports) {

  // Construct-o-rama.
  function Task() {
    // Helpers.
    this._helpers = {};
    // Tasks.
    this._tasks = {};
    // Task queue.
    this._queue = [];
    // Queue placeholder (for dealing with nested tasks).
    this._placeholder = {};
    // Options.
    this._options = {};
    // Is the queue running?
    this._running = false;
    // Success status of completed tasks.
    this._success = {};
  }

  // Expose the constructor function.
  exports.Task = Task;

  // Create a new Task instance.
  exports.create = function() {
    return new Task();
  };

  // Register a new helper.
  Task.prototype.registerHelper = function(name, fn) {
    // Add task into cache.
    this._helpers[name] = fn;
    // Make chainable!
    return this;
  };

  // Rename a helper. This might be useful if you want to override the default
  // behavior of a helper, while retaining the old name (to avoid having to
  // completely recreate an already-made task just because you needed to
  // override or extend a built-in helper).
  Task.prototype.renameHelper = function(oldname, newname) {
    // Rename helper.
    this._helpers[newname] = this._helpers[oldname];
    // Remove old name.
    delete this._helpers[oldname];
    // Make chainable!
    return this;
  };

  // Execute a helper.
  Task.prototype.helper = function(name) {
    var helper = this._helpers[name];
    if (!helper) {
      // Helper not found. Throw an exception.
      throw {name: 'HelperError', message: 'Helper "' + name + '" not found.'};
    } else {
      // Helper found. Invoke it with any remaining arguments and return its
      // value.
      return helper.apply(this, [].slice.call(arguments, 1));
    }
  };

  // Register a new task.
  Task.prototype.registerTask = function(name, data, fn) {
    // Add task into cache.
    this._tasks[name] = {name: name, data: data, fn: fn};
    // Make chainable!
    return this;
  };

  // Rename a task. This might be useful if you want to override the default
  // behavior of a task, while retaining the old name. This is a billion times
  // easier to implement than some kind of in-task "super" functionality.
  Task.prototype.renameTask = function(oldname, newname) {
    // Rename helper.
    this._tasks[newname] = this._tasks[oldname];
    // Remove old name.
    delete this._tasks[oldname];
    // Make chainable!
    return this;
  };

  // Argument parsing helper. Supports these signatures:
  //  fn('foo')                 // ['foo']
  //  fn('foo bar baz')         // ['foo', 'bar', 'baz']
  //  fn('foo', 'bar', 'baz')   // ['foo', 'bar', 'baz']
  //  fn(['foo', 'bar', 'baz']) // ['foo', 'bar', 'baz']
  Task.prototype._parseArgs = function(_arguments) {
    // If there are multiple (or zero) arguments, convert the _arguments object
    // into an array and return that.
    return _arguments.length !== 1 ? [].slice.call(_arguments) :
      // Return the first argument if it's an Array.
      _arguments[0] instanceof Array ? _arguments[0] :
      // Split the first argument on space.
      typeof _arguments[0] === 'string' ? _arguments[0].split(/\s+/) :
      // Just return an array containing the first argument. (todo: deprecate)
      [_arguments[0]];
  };

  // Enqueue a task.
  Task.prototype.run = function() {
    // Parse arguments into an array, returning an array of tasks.
    var tasks = this._parseArgs(arguments).map(function(name) {
      var task = this._tasks[name];
      if (!task) {
        // Task not found. Throw an exception.
        throw {name: 'TaskError', message: 'Task "' + name + '" not found.'};
      }
      return task;
    }.bind(this));
    // Get current placeholder index.
    var index = this._queue.indexOf(this._placeholder);
    if (index === -1) {
      // No placeholder, add tasks to end of queue.
      this._queue = this._queue.concat(tasks);
    } else {
      // Placeholder exists, add tasks just before placeholder.
      [].splice.apply(this._queue, [index, 0].concat(tasks));
    }
    // Make chainable!
    return this;
  };

  // Override default options.
  Task.prototype.options = function(options) {
    Object.keys(options).forEach(function(name) {
      this._options[name] = options[name];
    }.bind(this));
  };

  // Begin task queue processing. Ie. run all tasks.
  Task.prototype.start = function() {
    // Abort if already running.
    if (this._running) { return false; }
    // Actually process the next task.
    var nextTask = function() {
      // Async flag.
      var async = false;
      // Get next task from queue.
      var task;
      // Skip any placeholders.
      do { task = this._queue.shift(); } while (task === this._placeholder);
      // If queue was empty, we're all done.
      if (!task) {
        this._running = false;
        if (this._options.done) {
          this._options.done();
        }
        return;
      }
      // Add a placeholder to the front of the queue.
      this._queue.unshift(this._placeholder);
      // Update the internal status object and run the next task.
      var complete = function(status) {
        // A task has "failed" only if it returns false (async) or if the
        // function returned by .async is passed false.
        this._success[task.name] = status !== false;
        // Run the next task.
        nextTask();
      }.bind(this);
      
      try {
        // Get the current task and run it, setting `this` inside the task
        // function to be something useful.
        var status = task.fn.call({
          // The current task name.
          name: task.name,
          // When called, sets the async flag and returns a function that can be
          // used to continue processing the queue.
          async: function() {
            async = true;
            return complete;
          }
        });
        // If the async flag wasn't set, process the next task in the queue.
        if (!async) {
          complete(status);
        }
      } catch (e) {
        if (e.name === 'RequiresError') {
          if (this._options.error) {
            this._options.error.call({name: task.name}, e);
          }
          complete(false);
        } else {
          throw e;
        }
      }
    }.bind(this);
    // Update flag.
    this._running = true;
    // Process the next task.
    nextTask();
  };
  
  // Test to see if all of the given tasks have succeeded.
  Task.prototype.requires = function() {
    this._parseArgs(arguments).forEach(function(name) {
      var success = this._success[name];
      if (!success) {
        throw {name: 'RequiresError', message: 'Required task "' + name + '" ' + (success === false ? 'failed' : 'missing') + '.'};
      }
    }.bind(this));
  };

}(typeof exports === 'object' && exports || this));
