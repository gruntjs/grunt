(function(exports) {

  // The only reason this is done using prototypal inheritance is so that it
  // can be tested by grunt, which also uses this task interface.
  exports.create = function() {
    return new Task();
  };

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
    // Add task into cache.
    this.tasks[name] = {name: name, fn: fn};
    // Make chainable!
    return this;
  };

  // Enqueue a task.
  Task.prototype.task = function(names) {
    // The `names` arg can be a string or an array of strings. Or, if multiple
    // string arguments are passed in, handle that.
    if (arguments.length > 1) {
      names = [].slice.call(arguments);
    }
    // Just a little error checking.
    (typeof names === 'string' ? [names] : names).forEach(function(name) {
      if (!this.tasks[name]) {
        throw new Error('Task "' + name + '" not found.');
      }
    }.bind(this));
    // Get current placeholder index.
    var index = this._queue.indexOf(this._placeholder);
    if (index === -1) {
      // No placeholder, add names to end of queue.
      this._queue = this._queue.concat(names);
    } else {
      // Placeholder exists, add names just before placeholder.
      [].splice.apply(this._queue, [index, 0].concat(names));
    }
    // Make chainable!
    return this;
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
      // Get next task name from queue.
      var name;
      // Skip any placeholders.
      do { name = this._queue.shift(); } while (name === this._placeholder);
      // If queue was empty, we're all done.
      if (!name) {
        this._running = false;
        this._doneFn && this._doneFn();
        return;
      }
      // Add a placeholder to the front of the queue.
      this._queue.unshift(this._placeholder);
      // Get the current task and run it, setting `this` inside the task
      // function to be something useful.
      var task = this.tasks[name];
      task.fn.call({
        // The current task name.
        name: task.name,
        // Yo dawg, I herd you like tasks (tasks can call other tasks).
        task: this.task.bind(this),
        // Execute a helper.
        helper: this.helper,
        // Required to get `this` to work inside helpers.
        helpers: this.helpers,
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
