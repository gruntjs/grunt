var nodeunit = require('nodeunit');

// Ugh. Monkey patching nodeunit so that arbitrary code can be run when it's
// done testing.
nodeunit._done = function() {};
nodeunit._runFiles = nodeunit.runFiles;
nodeunit.runFiles = function(files, options) {
  options._done = options.done;
  options.done = function() {
    var result = this._done.apply(this, arguments);
    nodeunit._done.apply(this, arguments);
    return result;
  };
  return this._runFiles(files, options);
};

// ============================================================================
// TASKS
// ============================================================================

// The default task. Override this in your grunt.js if you feel like it.
task.registerTask('test', 'Run unit tests.', function() {
  // Only run this task if tests have been defined.
  if (!config('test')) {
    verbose.writeln('No tests defined, skipping.');
    return;
  }

  var name = config('test.reporter') || (option('verbose') ? 'default' : 'minimal');
  var reporter = nodeunit.reporters[name];

  // Nodeunit tests run asynchronously.
  var done = this.async();
  // When done, do some stuff and then continue processing other tasks.
  nodeunit._done = function(arr) {
    if (arr.failures() > 0) {
      fail.warn('Test failure.');
    }
    done();
  };

  // Run test(s).
  reporter.run(config('test.folders'));
});

// ============================================================================
// HELPERS
// ============================================================================

