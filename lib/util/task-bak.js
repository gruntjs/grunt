(function(exports) {

  // Construct-o-rama.
  function Task() {
    // Current queue of tasks to run.
    this._queue = [];
    // Options..
    this._options = {
      // Executed before each task. If this callback returns false, the current
      // task is skipped.
      pre: null,
      // Executed after each task. If this callback returns false, all further
      // tasks are skipped.
      post: null,
      // Executed after all tasks have been processed and/or skipped.
      done: null
    };
    // Are tasks currently being processed?
    this._running = false;
    // A helper for queue management.
    this._placeholder = {};
    // Per-task success/fail values.
    this._status = {};
    // All tasks.
    this.tasks = {};
    // All helpers.
    this.helpers = {};
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
    this.helpers[name] = fn;
    // Make chainable!
    return this;
  };

  // Rename a helper. This might be useful if you want to override the default
  // behavior of a helper, while retaining the old name (to avoid having to
  // completely recreate an already-made task).
  Task.prototype.renameHelper = function(oldname, newname) {
    // Rename helper.
    this.helpers[newname] = this.helpers[oldname];
    // Remove old name.
    delete this.helpers[oldname];
    // Make chainable!
    return this;
  };

  // Execute a helper.
  Task.prototype.helper = function(name) {
    var helper = this.helpers[name];
    if (!helper) {
      // Helper not found. Throw an exception.
      throw new Error('Helper "' + name + '" not found.');
    } else {
      // Helper found. Invoke it with any remaining arguments and return its
      // value.
      return helper.apply(this, [].slice.call(arguments, 1));
    }
  };

  // If something is passed instead of a function as the 2nd argument to
  // registerTask, it's a "shortcut" list of tasks.
  Task.prototype._parseFn = function(fn) {
    return typeof fn === 'function' ? fn : this.run.bind(this, fn);
  };

  // Given a task name, determine which actual task will be called, and what
  // arguments will be passed into the task callback. foo -> task "foo", no
  // args. foo:bar -> task "foo:bar" (if exists) otherwise task "foo". Both
  // tasks receive argument "bar". Etc.
  Task.prototype._parseTaskName = function(name) {
    var parts = name.split(':');
    var result = {args: parts.slice(1)};
    if (this.tasks[name]) {
      // A task with the exact name, as-passed, was found.
      result.name = name;
    } else if (this.tasks[parts[0]]) {
      // A task with the passed name wasn't found, but a task matching
      // everything before the ":" was found (Eg. "foo" from "foo:bar").
      result.name = parts[0];
    } else {
      // A matching task was not found.
      result = false;
    }
    return result;
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

  // Register a new task.
  Task.prototype.registerTask = function(name, info, fn) {
    // Add task into cache, with a reference to any previously-defined task of
    // the same name, if it exists.
    this.tasks[name] = {name: name, info: info, fn: this._parseFn(fn), superTask: this.tasks[name]};
    // Make chainable!
    return this;
  };

  // Enqueue a task.
  Task.prototype.run = function() {
    // Create an array of tasks, and check to ensure that tasks are defined.
    var tasks = this._parseArgs(arguments).map(function(name) {
      // Passed task can be a task object or the name of a task.
      var task;
      if (typeof name === 'string') {
        task = this._parseTaskName(name);
      } else {
        task = name;
      }
      if (!task) {
        throw new Error('Task "' + name + '" not found.');
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

  // Test to see if all of the given tasks have succeeded.
  Task.prototype.succeeded = function() {
    return this._parseArgs(arguments).every(function(name) {
      return this._status[name];
    }.bind(this));
  };

  // Test to see if any of the given tasks have failed.
  Task.prototype.failed = function() {
    return this._parseArgs(arguments).some(function(name) {
      return this._status[name] === false;
    }.bind(this));
  };

  // Enqueue the "super" task of a task. Ie. the task that another task has
  // overridden. If there is no super task, do nothing.
  Task.prototype._super = function(task) {
    if (task.superTask) {
      // Enqueue super task if it exists (and make chainable).
      return this.run(task.superTask);
    } else {
      // Make chainable!
      return this;
    }
  };

  // Override default options.
  Task.prototype.options = function(options) {
    Object.keys(options).forEach(function(name) {
      this._options[name] = options[name];
    });
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
        if (this._doneFn) {
          this._doneFn();
        }
        return;
      }
      // Add a placeholder to the front of the queue.
      this._queue.unshift(this._placeholder);
      // Update the internal status object and run the next task.
      var complete = function(status) {
        // A task has "failed" only if it returns false (async) or if the
        // function returned by .async is passed false.
        this._status[task.name] = status !== false;
        // Run the next task.
        nextTask();
      }.bind(this);
      // Get the current task and run it, setting `this` inside the task
      // function to be something useful.
      var status = task.fn.call({
        // The current task name.
        name: task.name,
        // Execute the `super` task for this task.
        superTask: this._super.bind(this, task),
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
    }.bind(this);
    // Update flag.
    this._running = true;
    // Process the next task.
    nextTask();
  };

}(typeof exports === 'object' && exports || this));
