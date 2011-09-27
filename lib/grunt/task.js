var path = require('path');
var fs = require('fs');

// This gets reused, so let's save it for later.
var slice = [].slice;

// ============================================================================
// HELPERS
// ============================================================================

// All helpers go here.
exports.helpers = {};

// Register a helper.
exports.registerHelper = function(name, fn) {
  registry.helpers.push(name);
  //verbose.write('Registering "' + name + '" helper...').ok();
  exports.helpers[name] = fn;
};

// Execute a helper by name.
exports.helper = function(name) {
  // Invoke the helper function with all args passed after the name.
  return exports.helpers[name].apply(this, slice.call(arguments, 1));
};

// ============================================================================
// TASKS
// ============================================================================

// All tasks go here.
exports.tasks = {};

// Register a task.
exports.registerTask = function(name, info, fn) {
  registry.tasks.push(name);
  //verbose.write('Registering "' + name + '" task...').ok();
  exports.tasks[name] = {info: info, fn: fn, prev: exports.tasks[name]};
};

// Execute a task by name.
exports.task = function(name) {
  // Get task object.
  var task = exports.tasks[name];
  // Oops?
  if (!task) {
    fail.warn('Task "' + name + '" not found.');
  } else {
    verbose.indent(0).header('Running "' + name + '" task').indent();
    // Actually execute the task/subtask function, setting `this` to something
    // useful.
    task.fn.apply({
      name: name,
      task: exports.task,
      helper: exports.helper,
      needs: exports.needs,
      super: task.prev ? task.prev.fn : function() {}
    }, slice.call(arguments, 1));
  }
  // Make chainable!
  return this;
};

// Test to see if required build params have been defined.
exports.needs = function() {
  var props = [].slice.call(arguments);
  var msg = 'Verifying option' + (props.length > 1 ? 's' : '') + ' ' + log.wordlist(props) + ' in build file...';
  verbose.write(msg);
  var failProps = __build && props.filter(function(prop) { return !__build[prop]; });
  if (__build && failProps.length === 0) {
    verbose.ok();
    return true;
  } else {
    verbose.or.write(msg);
    log.error().indent();
    if (!__build) {
      log.error('Unable to load options from build file.');
    } else {
      failProps.forEach(function(prop) {
        log.error('Required property "' + prop + '" missing.');
      });
    }
    fail.warn('Unable to process ' + this.name + ' task.');
    log.unindent();
  }
};

// ============================================================================
// INIT
// ============================================================================

// Initialize tasks.
exports.init = function(nofatal) {
  // Load all built-in tasks.
  var tasksdir = path.join(__dirname, 'tasks');
  fs.readdirSync(tasksdir).forEach(function(filename) {
    loadTask(path.join(tasksdir, filename), 'built-in');
  });

  // Get any local build data or tasks that might exist. Use --build override
  // if specified, otherwise look for a local grunt.js file.
  var buildfile = __options.build || path.join(process.cwd(), 'grunt.js');
  var basename = path.basename(buildfile);

  if (path.existsSync(buildfile)) {
    // Load local tasks, if the file exists.
    loadTask(buildfile, 'custom');
  } else if (__options.build) {
    // If --tasks override was specified and it doesn't exist, complain.
    fail.warn('Unable to find "' + buildfile + '" build file.');
  }
};

// Load tasks and handlers from a given tasks file.
var registry = {};
function loadTask(filepath, info) {
  registry.tasks = [];
  registry.helpers = [];
  var file = path.basename(filepath);
  var msg = 'Loading ' + info + ' "' + file + '" tasks file...';
  verbose.write(msg);
  try {
    // Load taskfile.
    require(filepath);
    verbose.ok().indent(function() {
      if (registry.tasks.length > 0) {
        verbose.writeln('Tasks: ' + log.wordlist(registry.tasks));
      }
      if (registry.helpers.length > 0) {
        verbose.writeln('Helpers: ' + log.wordlist(registry.helpers));
      }
    });
  } catch(e) {
    // Something went wrong.
    verbose.or.write(msg);
    log.error().indent().error(e.message).unindent();
  }
}

