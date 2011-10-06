var nodeunit = require('nodeunit');

// Ugh. Monkey patching nodeunit so that arbitrary code (like the next task)
// can be run when it's done testing. Good times.
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

task.registerTask('test', 'Run unit tests.', function() {
  // Fail if any required config properties have been omitted.
  if (!config.needs('test')) { return; }

  // Use a nodeunit reporter if specified.
  var name = config('test.reporter');
  // Otherwise use "default" if --verbose, and "minimal" if not.
  if (!name) {
    name = option('verbose') ? 'default' : 'minimal';
  }

  // The actual nodeunit reporter.
  var reporter = nodeunit.reporters[name];

  // Abort if reporter can't be found.
  if (!reporter) {
    fail.warn('Invalid nodeunit reporter "' + name + '" specified.');
    return;
  }

  // Nodeunit tests run asynchronously!
  var done = this.async();

  // When done, do some stuff and then continue processing other tasks. See
  // the delightful monkey patch at the top of this file.
  nodeunit._done = function(arr) {
    if (arr.failures() > 0) {
      fail.warn('Test failure.');
    }
    done();
  };

  // Run test(s).
  var filepaths = file.files(config('test.files'));
  reporter.run(filepaths);
});
