var options = grequire('cli').options;

// Write a line of output.
var writeln = exports.writeln = function(msg) {
  if (options.silent) { return; }
  console.log(msg);
};

// Verbose logging. Only shows up if -v or --verbose is used.
exports.chatter = function(msg) {
  if (options.verbose) {
    writeln(msg)
  }
};