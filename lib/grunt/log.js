// Write a line of output. Disable logging if -s or --silent is used.
var writeln = exports.writeln = function(msg) {
  if (__options.silent) { return; }
  console.log(msg);
};

// Verbose logging. Only shows up if -v or --verbose is used.
exports.chatter = function(msg) {
  if (__options.verbose) {
    writeln(msg)
  }
};