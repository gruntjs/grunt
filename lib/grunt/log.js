var colors = require('colors');

// If this flag is set, suppress indenting. It should be true until a newline
// has been written, at which point it is reset to false.
var suppressIndent;
// The current indent counter.
var indentCount = 0;

// Indent.
exports.indent = function(arg) {
  if (typeof arg === 'function') {
    indentCount++;
    arg.call(this);
    indentCount--;
  } else if (arg === 0) {
    indentCount = 0;
  } else {
    indentCount += arg || 1;
  }
  indentCount = Math.max(indentCount, 0);
  // Chainable!
  return this;
};

// Unindent.
exports.unindent = function() {
  return this.indent(-1);
};

// The actual indent string, based on the indentCount.
function indentString() {
  return suppressIndent ? '' : Array(indentCount + 1).join(' ');
}

// Write output.
exports.write = function(msg) {
  // Actually write output.
  process.stdout.write(indentString() + msg);
  // Indentaton is suppressed.
  suppressIndent = true;
  // Chainable!
  return this;
};

// Write a line of output.
exports.writeln = function(msg) {
  // Actually write output.
  this.write(msg + '\n');
  // A newline was written, indentaton is no longersuppressed.
  suppressIndent = false;
  // Chainable!
  return this;
};

// Stuff.
exports.ok = function(msg) { return this.writeln(msg ? '>> '.green + msg : 'OK'.green); };
exports.error = function(msg) { return this.writeln(msg ? '>> '.red + msg : 'ERROR'.red); };
exports.success = function(msg) { return this.writeln(msg.green); };
exports.fail = function(msg) { return this.writeln(msg.red); };
exports.header = function(msg) { return this.writeln(msg.underline); };

// Create explicit "verbose" and "notverbose" functions, one for each already-
// defined log function, that do the same thing but ONLY if -v or --verbose is
// specified (or not specified).
exports.verbose = {};
exports.notverbose = {};

Object.keys(exports).filter(function(key) {
  return typeof exports[key] === 'function';
}).forEach(function(key) {
  exports.verbose[key] = function() {
    return __options.verbose ? exports[key].apply(this, arguments) : this;
  }
  exports.notverbose[key] = function() {
    return __options.verbose ? this : exports[key].apply(this, arguments);
  }
});
