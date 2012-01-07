var nodeunit = require('nodeunit');

// Ugh. Monkey patching nodeunit so that arbitrary code (like the next task)
// can be run when it's done testing. Good times.
// https://github.com/caolan/nodeunit/pull/85
// https://github.com/caolan/nodeunit/pull/118
nodeunit._done = function() {/*nothing*/};
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

task.registerBasicTask('test', 'Run unit tests.*', function(data, name) {
  // The actual nodeunit reporter. Use "default" if --verbose, and "minimal"
  // if not.
  var reporter = nodeunit.reporters[option('verbose') ? 'default' : 'minimal'];

  // Nodeunit tests run asynchronously!
  var done = this.async();

  // When testing is done, continue processing other tasks. See the delightful
  // monkey patch at the top of this file.
  nodeunit._done = function(arr) {
    done(arr.failures() === 0);
  };

  // File paths.
  var filepaths = file.expand(data);
  // Clear all tests' cached require data, in case this task is run inside a
  // "watch" task loop.
  file.clearRequireCache(filepaths);
  // Run test(s).
  reporter.run(filepaths);
});
