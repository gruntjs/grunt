(function(exports) {

  // Construct-o-rama.
  function Task() {
    // Current queue of tasks to run.
    this._queue = [];
    // Function to execute when all tasks have completed.
    this._doneFn = null;
    // Are tasks currently being processed?
    this._running = false;
    // A helper for queue management.
    this._placeholder = {};
    // All tasks.
    this.tasks = {};
    // All helpers.
    this.helpers = {};
  }

  // The only reason this is done using prototypal inheritance is so that it
  // can be tested by grunt, which also uses this task interface.
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

  // Execute a helper.
  Task.prototype.helper = function(name) {
    var helper = this.helpers[name];
    if (!helper) {
      throw new Error('Helper "' + name + '" not found.');
    } else {
      return helper.apply(this, [].slice.call(arguments, 1));
    }
  };

  // Register a new task.
  Task.prototype.registerTask = function(name, fn) {
    // Add task into cache, with a reference to any previously-defined task of
    // the same name, if it exists. Somebody please come up with a better name
    // than `super`.
    this.tasks[name] = {name: name, fn: fn, superTask: this.tasks[name]};
    // Make chainable!
    return this;
  };

  // Enqueue a task.
  Task.prototype.task = function() {
    // Use the first argument if it's an Array, otherwise convert the arguments
    // object to an array and use that.
    var names = arguments[0] instanceof Array ? arguments[0] : [].slice.call(arguments);
    // Create an array of tasks, and check to ensure that tasks are defined.
    var tasks = names.map(function(name) {
      var task = typeof name === 'string' ? this.tasks[name] : name;
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

  // Enqueue the "super" task of a task. Ie. the task that another task has
  // overridden. If there is no super task, do nothing.
  Task.prototype._super = function(task) {
    if (task.superTask) {
      // Enqueue super task if it exists (and make chainable).
      return this.task(task.superTask);
    } else {
      // Make chainable!
      return this;
    }
  };

  // When task queue is done processing, execute this function.
  Task.prototype.done = function(fn) {
    // Save for later.
    this._doneFn = fn;
    // Make chainable!
    return this;
  };

  // Begin task queue processing. Ie. run all tasks.
  Task.prototype.run = function() {
    // Abort if already running.
    if (this._running) { return false; }
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
      // Get the current task and run it, setting `this` inside the task
      // function to be something useful.
      task.fn.call({
        // The current task name.
        name: task.name,
        // Yo dawg, I herd you like tasks (tasks can call other tasks).
        task: this.task.bind(this),
        // Execute a helper.
        helper: this.helper,
        // Required to get `this` to work inside helpers.
        helpers: this.helpers,
        // Execute the `super` task for this task.
        superTask: this._super.bind(this, task),
        // When called, sets the async flag and returns a function that can be
        // used to continue processing the queue.
        async: function() {
          async = true;
          return nextTask;
        }
      });
      // If the async flag wasn't set, process the next task in the queue.
      if (!async) {
        nextTask();
      }
    }.bind(this);
    // Update flag.
    this._running = true;
    // Process the next task.
    nextTask();
  };

}(typeof exports === 'object' && exports || this));
