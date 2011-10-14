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

task.registerTask('test', 'Run unit tests.*', function(name) {
  if (!name) {
    // An argument wasn't passed. Run this task once for each concat sub-prop.
    return task.runAllProps('test');
  }

  // Any name with a possible "." has to be escaped!
  var propname = 'test.' + config.escape(name);

  // Fail if any required config properties have been omitted.
  config.requires(propname);

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

  // Run test(s).
  var filepaths = file.expand(config(propname));
  reporter.run(filepaths);
});
