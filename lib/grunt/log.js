var colors = require('colors');

// Write output.
exports.write = function(msg) {
  // Abort if -s or --silent is used.
  if (__options.silent) { return; }
  // Actually write output.
  process.stdout.write(msg);
  // Chainable!
  return this;
};

// Write a line of output.
exports.writeln = function(msg) {
  return this.write(msg + '\n');
};

// Ok.
exports.ok = function(msg) {
  return this.writeln(msg ? '>> '.green + msg : 'OK'.green);
};

// Error.
exports.error = function(msg) {
  return this.writeln(msg ? '>> '.red + msg : 'ERROR'.red);
};

// Create explicit "verbose" functions, one for each already-defined log
// function, that do the same thing but ONLY if -v or --verbose is used.
exports.verbose = {};
Object.keys(exports).filter(function(key) {
  return typeof exports[key] === 'function';
}).forEach(function(key) {
  exports.verbose[key] = function() {
    __options.verbose && exports[key].apply(this, arguments);
  }
});
