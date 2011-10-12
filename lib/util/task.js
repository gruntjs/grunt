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
  Task.prototype.registerTask = function(name, info, fn) {
    // If optional "info" string is omitted, shuffle arguments a bit.
    if (fn == null) {
      fn = info;
      info = '';
    }
    // String or array of strings was passed instead of fn.
    var tasks;
    if (typeof fn !== 'function') {
      // Array of task names.
      tasks = this._parseArgs([fn]);
      // This task function just runs the specified tasks.
      fn = this.run.bind(this, fn);
      // Generate an info string if one wasn't explicitly passed.
      if (!info) {
        info = 'Alias for "' + tasks.join(' ') + '" task' +
          (tasks.length === 1 ? '' : 's') + '.';
      }
    }
    // Add task into cache.
    this._tasks[name] = {name: name, info: info, fn: fn};
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
  
  // Given a task name, determine which actual task will be called, and what
  // arguments will be passed into the task callback. foo -> task "foo", no
  // args. foo:bar -> task "foo:bar" (if exists) otherwise task "foo". Both
  // tasks receive argument "bar". Etc.
  Task.prototype._taskPlusArgs = function(name) {
    // Arguments to be applied to the task function.
    var args = name.split(':').slice(1);
    // The task.
    var task;
    do {
      task = this._tasks[name];
    } while (!task && (name = name.replace(/:?[^:]+$/, '')));
    // The task to run and the args to run it with.
    return {task: task, args: args};
  };

  // Enqueue a task.
  Task.prototype.run = function() {
    // Parse arguments into an array, returning an array of task+args objects.
    var things = this._parseArgs(arguments).map(function(name) {
      var taskArgs = this._taskPlusArgs(name);
      if (!taskArgs.task) {
        // Task not found. Throw an exception.
        throw {name: 'TaskError', message: 'Task "' + name + '" not found.'};
      }
      return taskArgs;
    }.bind(this));
    // Get current placeholder index.
    var index = this._queue.indexOf(this._placeholder);
    if (index === -1) {
      // No placeholder, add task+args objects to end of queue.
      this._queue = this._queue.concat(things);
    } else {
      // Placeholder exists, add task+args objects just before placeholder.
      [].splice.apply(this._queue, [index, 0].concat(things));
    }
    // Make chainable!
    return this;
  };

  // Begin task queue processing. Ie. run all tasks.
  Task.prototype.start = function() {
    // Abort if already running.
    if (this._running) { return false; }
    // Actually process the next task.
    var nextTask = function() {
      // Async flag.
      var async = false;
      // Get next task+args object from queue.
      var thing;
      // Skip any placeholders.
      do { thing = this._queue.shift(); } while (thing === this._placeholder);
      // If queue was empty, we're all done.
      if (!thing) {
        this._running = false;
        if (this._options.done) {
          this._options.done();
        }
        return;
      }
      // The task object.
      var task = thing.task;
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
        var status = task.fn.apply({
          // The current task name.
          name: task.name,
          // When called, sets the async flag and returns a function that can be
          // used to continue processing the queue.
          async: function() {
            async = true;
            return complete;
          }
        }, thing.args);
        // If the async flag wasn't set, process the next task in the queue.
        if (!async) {
          complete(status);
        }
      } catch (e) {
        if (e.name === 'TaskError' || e.name === 'HandlerError') {
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
        throw {name: 'TaskError', message: 'Required task "' + name +
          '" ' + (success === false ? 'failed' : 'missing') + '.'};
      }
    }.bind(this));
  };

  // Override default options.
  Task.prototype.options = function(options) {
    Object.keys(options).forEach(function(name) {
      this._options[name] = options[name];
    }.bind(this));
  };

}(typeof exports === 'object' && exports || this));
